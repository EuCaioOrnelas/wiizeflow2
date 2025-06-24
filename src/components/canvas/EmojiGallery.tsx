
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface EmojiGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
  currentEmoji?: string;
}

const emojiCategories = {
  'Objetos': ['📝', '📊', '📈', '📉', '💼', '💰', '💎', '🔥', '⚡', '💡', '🎯', '🚀', '⭐', '✨', '🎉', '🏆', '👑', '💻', '📱', '⚙️', '🔧', '🔨', '📋', '📌', '📍', '🗂️', '📁', '📂', '🗃️', '📑', '📄', '📃', '📜', '📰', '🗞️', '📺', '📻', '☎️', '📞', '📟', '📠', '🔍', '🔎', '💳', '💰', '💸', '💵', '💴', '💶', '💷'],
  'Símbolos': ['✅', '❌', '❓', '❗', '💯', '🔔', '🔕', '🔊', '🔇', '📢', '📣', '💬', '💭', '🗯️', '♠️', '♥️', '♦️', '♣️', '🎵', '🎶', '🎼', '🎤', '🎧', '📻', '🎷', '🎸', '🎹', '🥁', '🎺', '📯', '🎻', '🪕', '🎮', '🕹️', '🎯', '🎲', '🎰', '🎳'],
  'Emoticons': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴'],
  'Gestos': ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦵', '🦿', '🦶'],
  'Natureza': ['🌱', '🌿', '🍀', '🌾', '🌵', '🌲', '🌳', '🌴', '🌸', '🌺', '🌻', '🌹', '🥀', '🌷', '💐', '🌼', '🌙', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌟', '💫', '⭐', '🌠', '☀️', '⛅', '⛈️', '🌤️', '🌦️', '🌧️', '⚡', '❄️', '☃️', '⛄'],
  'Transporte': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛹', '🚁', '🛸', '🚀', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚢', '🛥️', '🚤', '⛵', '🛶', '🚉', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚍']
};

export const EmojiGallery = ({ isOpen, onClose, onEmojiSelect, currentEmoji }: EmojiGalleryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Objetos');

  const filteredEmojis = emojiCategories[selectedCategory as keyof typeof emojiCategories].filter(emoji =>
    !searchTerm || emoji.includes(searchTerm)
  );

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    onClose();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCategoryClick = (category: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCategory(category);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md max-h-[80vh] overflow-hidden flex flex-col"
        onClick={handleContentClick}
      >
        <DialogHeader onClick={handleContentClick}>
          <DialogTitle>Escolher Emoji</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 overflow-hidden flex flex-col" onClick={handleContentClick}>
          {/* Busca */}
          <div className="relative" onClick={handleSearchClick}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar emoji..."
              value={searchTerm}
              onChange={handleSearchChange}
              onClick={handleSearchClick}
              className="pl-10"
            />
          </div>

          {/* Categorias */}
          <div className="flex gap-1 overflow-x-auto pb-2" onClick={handleContentClick}>
            {Object.keys(emojiCategories).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={(e) => handleCategoryClick(category, e)}
                className="whitespace-nowrap text-xs"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Grade de Emojis */}
          <div className="grid grid-cols-8 gap-2 overflow-y-auto flex-1 pr-2" onClick={handleContentClick}>
            {filteredEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEmojiClick(emoji);
                }}
                className={`w-10 h-10 text-2xl hover:bg-gray-100 rounded flex items-center justify-center transition-colors ${
                  currentEmoji === emoji ? 'bg-blue-100 ring-2 ring-blue-500' : ''
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t" onClick={handleContentClick}>
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
