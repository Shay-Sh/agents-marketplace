'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Bot, 
  MessageSquare, 
  Brain, 
  Zap, 
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Star,
  Heart,
  Shield,
  Settings,
  User,
  Users,
  Mail,
  Phone,
  Target,
  TrendingUp,
  BarChart,
  PieChart,
  Database,
  Server,
  Code,
  Terminal,
  Cpu,
  Headphones,
  Mic,
  Volume2,
  File,
  FileText,
  Image,
  Folder,
  Archive,
  Award,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Grid,
  Layout,
  Menu
} from 'lucide-react';

// Icon categories with their icons
const iconCategories = {
  'AI & Tech': [
    { name: 'Bot', icon: Bot },
    { name: 'Brain', icon: Brain },
    { name: 'Zap', icon: Zap },
    { name: 'Cpu', icon: Cpu },
    { name: 'Database', icon: Database },
    { name: 'Server', icon: Server },
    { name: 'Code', icon: Code },
    { name: 'Terminal', icon: Terminal },
  ],
  'Communication': [
    { name: 'MessageSquare', icon: MessageSquare },
    { name: 'Mail', icon: Mail },
    { name: 'Phone', icon: Phone },
    { name: 'Headphones', icon: Headphones },
    { name: 'Mic', icon: Mic },
    { name: 'Volume2', icon: Volume2 },
  ],
  'Business': [
    { name: 'TrendingUp', icon: TrendingUp },
    { name: 'BarChart', icon: BarChart },
    { name: 'PieChart', icon: PieChart },
    { name: 'Target', icon: Target },
    { name: 'Award', icon: Award },
    { name: 'ShoppingCart', icon: ShoppingCart },
    { name: 'CreditCard', icon: CreditCard },
    { name: 'DollarSign', icon: DollarSign },
  ],
  'People': [
    { name: 'User', icon: User },
    { name: 'Users', icon: Users },
    { name: 'Shield', icon: Shield },
    { name: 'Heart', icon: Heart },
    { name: 'Star', icon: Star },
  ],
  'Files': [
    { name: 'File', icon: File },
    { name: 'FileText', icon: FileText },
    { name: 'Image', icon: Image },
    { name: 'Folder', icon: Folder },
    { name: 'Archive', icon: Archive },
  ],
  'Interface': [
    { name: 'Settings', icon: Settings },
    { name: 'Search', icon: Search },
    { name: 'Filter', icon: Filter },
    { name: 'Menu', icon: Menu },
    { name: 'Grid', icon: Grid },
    { name: 'Layout', icon: Layout },
  ],
};

interface IconPickerProps {
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
}

export function IconPicker({ selectedIcon, onIconSelect }: IconPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('AI & Tech');
  const [isExpanded, setIsExpanded] = useState(false);

  // Get all icons for search
  const allIcons = Object.values(iconCategories).flat();
  
  // Filter icons based on search term
  const filteredIcons = searchTerm 
    ? allIcons.filter(icon => 
        icon.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : iconCategories[selectedCategory as keyof typeof iconCategories] || [];

  // Get the selected icon component
  const SelectedIconComponent = allIcons.find(icon => icon.name === selectedIcon)?.icon || Bot;

  return (
    <div className="space-y-4">
      {/* Current Selection Display */}
      <div className="flex items-center justify-between">
        <Label className="text-white">Selected Icon</Label>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
        >
          <SelectedIconComponent className="h-4 w-4" />
          <span>{selectedIcon}</span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Expanded Icon Picker */}
      {isExpanded && (
        <div className="border border-gray-700 rounded-lg p-4 bg-gray-800 space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label className="text-white">Search Icons</Label>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for an icon..."
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          {/* Categories */}
          {!searchTerm && (
            <div className="space-y-2">
              <Label className="text-white">Category</Label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(iconCategories).map((category) => (
                  <Button
                    key={category}
                    type="button"
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-white text-gray-900"
                        : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Icon Grid */}
          <div className="space-y-2">
            <Label className="text-white">
              {searchTerm ? `Search Results (${filteredIcons.length})` : `${selectedCategory} Icons`}
            </Label>
            <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
              {filteredIcons.map((icon) => {
                const IconComponent = icon.icon;
                const isSelected = selectedIcon === icon.name;
                
                return (
                  <Button
                    key={icon.name}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onIconSelect(icon.name);
                      setIsExpanded(false);
                    }}
                    className={`aspect-square p-2 ${
                      isSelected
                        ? "bg-white text-gray-900 border-white"
                        : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    }`}
                    title={icon.name}
                  >
                    <IconComponent className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>
            
            {filteredIcons.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No icons found matching &quot;{searchTerm}&quot;</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}