import { useState, useEffect, useRef } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface TagNameInputProps {
  value: string;
  onChange: (value: string) => void;
  existingTags: string[];
  label?: string;
  placeholder?: string;
  onEnterPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function TagNameInput({ 
  value, 
  onChange, 
  existingTags, 
  label = "TagName",
  placeholder = "ej: 80s hits",
  onEnterPress
}: TagNameInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Flag para saber si el mouse está presionando el dropdown
  const isClickingDropdown = useRef(false);


  // El dropdown solo depende del focus del input, no de clicks externos

  useEffect(() => {
    if (value.trim() === '') {
      setFilteredTags(existingTags);
      // Si el input tiene focus, mostrar el dropdown
      if (document.activeElement === inputRef.current && existingTags.length > 0) {
        setIsOpen(true);
      }
    } else {
      const filtered = existingTags.filter(tag =>
        tag.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredTags(filtered);
      // Si el valor coincide exactamente con un tag existente, cerrar dropdown
      if (existingTags.some(tag => tag.toLowerCase() === value.trim().toLowerCase())) {
        setIsOpen(false);
      } else if (document.activeElement === inputRef.current && filtered.length > 0) {
        setIsOpen(true);
      }
    }
  }, [value, existingTags]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    if (!isOpen && existingTags.length > 0) setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsOpen(false);
      onEnterPress?.(e);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (!isOpen && existingTags.length > 0) {
      setIsOpen(true);
    }
  };

  const selectTag = (tag: string) => {
    onChange(tag);
    setTimeout(() => {
      setIsOpen(false);
      // Simula el trigger de Enter para pasar el focus al siguiente campo
      if (onEnterPress && inputRef.current) {
        const fakeEvent = { key: 'Enter', preventDefault: () => {}, currentTarget: inputRef.current } as unknown as React.KeyboardEvent<HTMLInputElement>;
        onEnterPress(fakeEvent);
      } else {
        inputRef.current?.focus();
      }
    }, 0);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center gap-2 mb-2">
        <Label htmlFor="tagname">{label}</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Asigna un nombre identificativo a tu lista. Si ya existen listas, puedes seleccionar uno de los nombres existentes.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="relative">
        <Input
          ref={inputRef}
          id="tagname"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => existingTags.length > 0 && setIsOpen(true)}
          onBlur={() => {
            setTimeout(() => {
              // Si el blur fue por click en dropdown, no cerrar
              if (isClickingDropdown.current) return;
              setIsOpen(false);
            }, 100);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className="pr-8"
        />
        {existingTags.length > 0 && (
          <ChevronDown 
            className="absolute right-3 top-3 h-4 w-4 text-muted-foreground cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
        )}
      </div>
      
      {isOpen && filteredTags.length > 0 && (
        <div
          className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-40 overflow-y-auto"
          onMouseDown={() => { isClickingDropdown.current = true; }}
          onMouseUp={() => { setTimeout(() => { isClickingDropdown.current = false; }, 0); }}
        >
          {filteredTags.map((tag, index) => (
            <div
              key={index}
              className="p-2 hover:bg-accent cursor-pointer text-sm"
              onClick={() => selectTag(tag)}
            >
              {tag}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}