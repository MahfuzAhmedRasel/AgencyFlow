import React from 'react';
import { CustomFieldDefinition } from '../../types';
import { ExternalLink, Check, Copy } from 'lucide-react';
import { ensureAbsoluteUrl } from '../../utils/formatters';

interface DynamicFormFieldsProps {
  fields: CustomFieldDefinition[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
}

export const DynamicFormFields: React.FC<DynamicFormFieldsProps> = ({
  fields,
  values,
  onChange,
  errors = {},
}) => {
  if (!fields || fields.length === 0) {
    return (
      <div className="p-4 bg-zinc-900/60 border border-dashed border-zinc-800 rounded-lg text-sm text-zinc-500 text-center">
        No custom fields defined for this workflow type.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((field) => {
        const val = values[field.key] !== undefined ? values[field.key] : field.defaultValue || '';
        const hasError = Boolean(errors[field.key]);

        return (
          <div
            key={field.id}
            className={`space-y-1.5 ${
              field.type === 'textarea' || field.type === 'multiselect' ? 'md:col-span-2' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {field.label}
                {field.required && <span className="text-rose-400 ml-1">*</span>}
              </label>
              {field.helpText && (
                <span className="text-[11px] text-zinc-500 truncate max-w-[200px]" title={field.helpText}>
                  {field.helpText}
                </span>
              )}
            </div>

            {field.type === 'text' && (
              <input
                type="text"
                value={val}
                placeholder={field.placeholder || ''}
                onChange={(e) => onChange(field.key, e.target.value)}
                className={`w-full px-3 py-2 bg-zinc-900 border rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
                  hasError ? 'border-rose-500' : 'border-zinc-800 focus:border-indigo-500'
                }`}
              />
            )}

            {field.type === 'number' && (
              <input
                type="number"
                value={val}
                placeholder={field.placeholder || '0'}
                onChange={(e) => onChange(field.key, e.target.value === '' ? '' : Number(e.target.value))}
                className={`w-full px-3 py-2 bg-zinc-900 border rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
                  hasError ? 'border-rose-500' : 'border-zinc-800 focus:border-indigo-500'
                }`}
              />
            )}

            {field.type === 'url' && (
              <div className="relative">
                <input
                  type="text"
                  value={val}
                  placeholder={field.placeholder || 'e.g. drive.google.com/... or link'}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className={`w-full pl-3 pr-8 py-2 bg-zinc-900 border rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
                    hasError ? 'border-rose-500' : 'border-zinc-800 focus:border-indigo-500'
                  }`}
                />
                {val && (
                  <a
                    href={ensureAbsoluteUrl(val)}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-indigo-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}

            {field.type === 'select' && (
              <select
                value={val}
                onChange={(e) => onChange(field.key, e.target.value)}
                className={`w-full px-3 py-2 bg-zinc-900 border rounded-lg text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
                  hasError ? 'border-rose-500' : 'border-zinc-800 focus:border-indigo-500'
                }`}
              >
                <option value="">Select option...</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {field.type === 'textarea' && (
              <textarea
                rows={3}
                value={val}
                placeholder={field.placeholder || ''}
                onChange={(e) => onChange(field.key, e.target.value)}
                className={`w-full px-3 py-2 bg-zinc-900 border rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-y ${
                  hasError ? 'border-rose-500' : 'border-zinc-800 focus:border-indigo-500'
                }`}
              />
            )}

            {field.type === 'boolean' && (
              <label className="flex items-center space-x-3 py-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={Boolean(val)}
                  onChange={(e) => onChange(field.key, e.target.checked)}
                  className="w-4 h-4 text-indigo-600 bg-zinc-900 border-zinc-700 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-zinc-300">
                  {val ? 'Enabled / Required' : 'Not required'}
                </span>
              </label>
            )}

            {hasError && <p className="text-xs text-rose-400">{errors[field.key]}</p>}
          </div>
        );
      })}
    </div>
  );
};

interface DynamicFieldsViewProps {
  fields: CustomFieldDefinition[];
  values: Record<string, any>;
}

export const DynamicFieldsView: React.FC<DynamicFieldsViewProps> = ({ fields, values }) => {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  if (!fields || fields.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {fields.map((field) => {
        const value = values?.[field.key];
        if (value === undefined || value === null || value === '') return null;

        const isUrl = typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));
        const isLongText = typeof value === 'string' && (value.length > 50 || field.type === 'textarea');

        return (
          <div
            key={field.id}
            className={`p-3 bg-zinc-900/80 border border-zinc-800/80 rounded-xl ${
              isLongText ? 'md:col-span-2' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">
                {field.label}
              </span>
              {typeof value === 'string' && (
                <button
                  onClick={() => handleCopy(value, field.key)}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  title="Copy to clipboard"
                >
                  {copiedKey === field.key ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            {isUrl ? (
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 break-all transition-colors underline underline-offset-2"
              >
                <span>{value}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            ) : typeof value === 'boolean' ? (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  value ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {value ? 'Yes, Required' : 'No'}
              </span>
            ) : isLongText ? (
              <p className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans bg-black/30 p-2.5 rounded-lg border border-zinc-800/50">
                {value}
              </p>
            ) : (
              <div className="text-sm font-medium text-zinc-100 flex items-center gap-2">
                <span className="bg-zinc-800/90 text-zinc-200 px-2 py-0.5 rounded text-xs font-mono">
                  {String(value)}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
