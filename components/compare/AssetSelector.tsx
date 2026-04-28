import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AssetData } from '../../data/assetRegistry';
import { AssetIcon } from '../AssetIcon';
import { trackEvent } from '../../utils/analytics';

interface AssetSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  registry: Record<string, AssetData>;
}

export const AssetSelector: React.FC<AssetSelectorProps> = ({ selectedIds, onChange, registry }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const availableAssets = Object.entries(registry).map(([key, asset]) => ({ key, ...asset }));
  const categories = ['All', ...Array.from(new Set(availableAssets.map(a => a.category)))];

  const filteredAssets = availableAssets.filter(asset => {
    const matchesSearch = asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || asset.category === activeCategory;
    const notSelected = !selectedIds.includes(asset.key);
    return matchesSearch && matchesCategory && notSelected;
  });

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  // Auto-focus search when dropdown opens
  useEffect(() => {
    if (showDropdown && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showDropdown]);

  const handleAdd = (id: string) => {
    if (selectedIds.length >= 10) return;
    
    // Track asset addition
    const asset = registry[id];
    if (asset) {
      trackEvent('asset_added', {
        asset_symbol: asset.symbol,
        asset_name: asset.name,
        asset_category: asset.category,
        total_selected: selectedIds.length + 1
      });
    }

    onChange([...selectedIds, id]);
    setSearchTerm('');
  };

  const handleRemove = (id: string) => {
    if (selectedIds.length <= 1) return;
    
    // Track asset removal
    const asset = registry[id];
    if (asset) {
      trackEvent('asset_removed', {
        asset_symbol: asset.symbol,
        asset_name: asset.name,
        asset_category: asset.category,
        total_selected: selectedIds.length - 1
      });
    }

    onChange(selectedIds.filter(selectedId => selectedId !== id));
  };

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
    if (showDropdown) {
      setSearchTerm('');
      setActiveCategory('All');
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Selected Pills */}
      <div className="flex flex-wrap items-center gap-2">
         {selectedIds.map(id => {
           const asset = registry[id];
           if (!asset) return null;
           return (
             <div key={id} className="flex items-center gap-2 bg-surface border border-border rounded-full pl-1.5 pr-1 py-1 group transition hover:border-primary/30">
               <AssetIcon symbol={asset.symbol} size={20} />
               <span className="text-sm font-bold">{asset.symbol}</span>
               <button 
                 onClick={() => handleRemove(id)}
                 className="p-1 rounded-full text-text-muted hover:bg-red-500/10 hover:text-red-400 transition-colors"
               >
                 <X size={12} />
               </button>
             </div>
           );
         })}
         
         {/* Add Asset Button + Dropdown */}
         <div className="relative" ref={dropdownRef}>
            <button 
              onClick={toggleDropdown}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold transition duration-200
                ${showDropdown 
                  ? 'bg-primary text-background border border-primary shadow-[0_0_12px_rgba(16,185,129,0.3)]' 
                  : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'}`}
            >
              <Plus size={14} className={showDropdown ? 'rotate-45 transition-transform' : 'transition-transform'} />
              Add Asset
              {selectedIds.length >= 10 && <span className="text-xs opacity-70">(Max)</span>}
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
            {showDropdown && (
              <>
                {/* Backdrop overlay - dims the page and catches outside clicks */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="fixed inset-0 z-[50] bg-black/40" 
                  onClick={() => setShowDropdown(false)} 
                />
                
                {/* Dropdown */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -10, x: "-50%" }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
                  exit={{ opacity: 0, scale: 0.95, y: -10, x: "-50%" }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-12 left-1/2 w-[360px] sm:w-[480px] md:w-[540px] rounded-xl z-[100] flex flex-col overflow-hidden bg-surface border border-border shadow-2xl origin-top"
                >
                 {/* Search */}
                 <div className="px-4 pt-4 pb-3 bg-surface">
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input 
                        ref={inputRef}
                        type="text" 
                        placeholder="Search ticker or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg pl-10 pr-4 py-2.5 text-sm text-text bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary/30 transition font-medium placeholder:text-text-muted/50"
                      />
                    </div>
                 </div>
                 
                 {/* Category Filters */}
                 <div className="flex gap-1.5 overflow-x-auto px-4 pb-3 scrollbar-hide bg-surface">
                    {categories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md whitespace-nowrap transition duration-150
                          ${activeCategory === cat 
                            ? 'bg-primary text-background' 
                            : 'bg-background text-text-muted hover:text-text'}`}
                      >
                         {cat}
                      </button>
                    ))}
                 </div>

                 {/* Divider */}
                 <div className="border-t border-border" />

                 {/* Asset List */}
                 <div className="max-h-[320px] overflow-y-auto py-2 px-2 flex flex-col gap-0.5 bg-surface"
                      style={{ scrollbarWidth: 'thin' }}>
                    {filteredAssets.length === 0 ? (
                       <div className="text-center py-8 text-sm text-text-muted">
                         <Search size={24} className="mx-auto mb-2 opacity-30" />
                         No matching assets
                       </div>
                    ) : (
                      filteredAssets.map(asset => (
                        <button 
                          key={asset.key}
                          onClick={() => handleAdd(asset.key)}
                          className="flex items-center justify-between px-3 py-2.5 rounded-lg transition w-full text-left group active:scale-[0.98] bg-surface hover:bg-background transform-gpu"
                        >
                           <div className="flex items-center gap-3 min-w-0">
                              <AssetIcon symbol={asset.symbol} size={32} />
                              <div className="min-w-0">
                                 <div className="font-bold text-sm text-text group-hover:text-primary transition-colors">{asset.symbol}</div>
                                 <div className="text-xs text-text-muted truncate max-w-[180px]">{asset.name}</div>
                              </div>
                           </div>
                           <span className="text-[9px] px-2 py-0.5 rounded text-text-muted uppercase font-bold tracking-wider shrink-0 ml-2 bg-background border border-border">
                              {asset.category}
                           </span>
                        </button>
                      ))
                    )}
                 </div>

                 {/* Footer hint */}
                 <div className="px-4 py-2 text-[10px] text-text-muted text-center bg-surface border-t border-border">
                   {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''} available · {selectedIds.length}/10 selected
                 </div>
              </motion.div>
              </>
            )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
};
