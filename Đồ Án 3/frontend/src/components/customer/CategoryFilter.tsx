import type { Category } from '../../types';

interface CategoryFilterProps {
  categories: Category[];
  selected: string;
  onChange: (categoryId: string) => void;
}

export default function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  const all = [{ _id: 'all', name: 'Tất Cả' }, ...categories];

  return (
    <div className="flex flex-wrap gap-2">
      {all.map((cat) => (
        <button
          key={cat._id}
          onClick={() => onChange(cat._id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
            selected === cat._id
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
