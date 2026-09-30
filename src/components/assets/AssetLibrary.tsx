import React, { useState, useMemo } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  FolderArchive,
  Upload,
  Search,
  Filter,
  Film,
  Image as ImageIcon,
  FileText,
  FileCode,
  Download,
  Trash2,
  ExternalLink,
  Eye,
  X,
  Plus,
} from 'lucide-react';
import { formatDate, ensureAbsoluteUrl } from '../../utils/formatters';
import { Asset } from '../../types';

export const AssetLibrary: React.FC = () => {
  const {
    assets,
    addAsset,
    deleteAsset,
    clients,
    projects,
    users,
    currentUser,
    canAssignTasks,
  } = useAgency();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');

  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // New asset form state
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState<Asset['fileType']>('image');
  const [category, setCategory] = useState<Asset['category']>('brand_asset');
  const [fileSize, setFileSize] = useState('18.2 MB');
  const [selectedClientId, setSelectedClientId] = useState('');

  // Filtered assets
  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!a.fileName.toLowerCase().includes(q)) return false;
      }
      if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
      if (typeFilter !== 'all' && a.fileType !== typeFilter) return false;
      if (clientFilter !== 'all' && a.clientId !== clientFilter) return false;
      return true;
    });
  }, [assets, searchQuery, categoryFilter, typeFilter, clientFilter]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim() || !fileUrl.trim()) return;

    addAsset({
      fileName: fileName.trim(),
      url: fileUrl.trim(),
      thumbnailUrl: fileType === 'image' ? fileUrl.trim() : undefined,
      fileType,
      category,
      fileSize: fileSize || '10 MB',
      uploaderId: currentUser.id,
      clientId: selectedClientId || undefined,
    });

    setFileName('');
    setFileUrl('');
    setIsUploadModalOpen(false);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'video':
        return Film;
      case 'image':
        return ImageIcon;
      case 'design_file':
        return FileCode;
      case 'archive':
        return FolderArchive;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2.5">
            <span>Creative Asset Library</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
              {filteredAssets.length} assets
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Central repository for client brand assets, raw footage, video renders, and Figma source kits.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2 shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Asset</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Categories</option>
          <option value="deliverable">Deliverables</option>
          <option value="brand_asset">Brand Assets</option>
          <option value="raw_footage">Raw Footage</option>
          <option value="reference">References</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All File Formats</option>
          <option value="video">Videos</option>
          <option value="image">Images</option>
          <option value="design_file">Design Files (Figma / PSD)</option>
          <option value="document">Documents / PDF</option>
          <option value="archive">ZIP Archives</option>
        </select>

        <select
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Clients</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.company}
            </option>
          ))}
        </select>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAssets.map((asset) => {
          const client = clients.find((c) => c.id === asset.clientId);
          const uploader = users.find((u) => u.id === asset.uploaderId);
          const Icon = getFileIcon(asset.fileType);

          return (
            <div
              key={asset.id}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden transition-all flex flex-col justify-between group"
            >
              {/* Thumbnail or Icon preview */}
              <div
                onClick={() => setPreviewAsset(asset)}
                className="h-36 bg-zinc-950 relative flex items-center justify-center cursor-pointer overflow-hidden group/thumb"
              >
                {asset.thumbnailUrl ? (
                  <img
                    src={asset.thumbnailUrl}
                    alt={asset.fileName}
                    className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover/thumb:text-indigo-400 transition-colors">
                    <Icon className="w-10 h-10" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="p-2 bg-zinc-900/90 text-white rounded-xl text-xs flex items-center gap-1 font-medium">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </span>
                </div>

                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-mono text-zinc-300 uppercase">
                  {asset.fileType.replace('_', ' ')}
                </span>
              </div>

              {/* Details */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider block truncate">
                    {client?.company || 'Agency Global'}
                  </span>
                  <h3
                    onClick={() => setPreviewAsset(asset)}
                    className="text-xs font-bold text-zinc-100 hover:text-indigo-300 cursor-pointer transition-colors truncate mt-0.5"
                    title={asset.fileName}
                  >
                    {asset.fileName}
                  </h3>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="font-mono">{asset.fileSize}</span>
                  <div className="flex items-center space-x-1.5">
                    <a
                      href={ensureAbsoluteUrl(asset.url)}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-zinc-400 hover:text-indigo-400 rounded transition-colors"
                      title="Open source link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    {(currentUser.role === 'admin' || currentUser.id === asset.uploaderId) && (
                      <button
                        onClick={() => deleteAsset(asset.id)}
                        className="p-1 text-zinc-500 hover:text-rose-400 rounded transition-colors"
                        title="Delete asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ASSET PREVIEW MODAL */}
      {previewAsset && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
              <div className="truncate pr-4">
                <h3 className="text-sm font-bold text-zinc-100 truncate">{previewAsset.fileName}</h3>
                <span className="text-xs text-zinc-400">{previewAsset.fileSize} • {previewAsset.category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={previewAsset.url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setPreviewAsset(null)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 flex items-center justify-center bg-black/50 overflow-auto">
              {previewAsset.fileType === 'video' ? (
                <video
                  src={previewAsset.url}
                  controls
                  className="max-h-[60vh] max-w-full rounded-xl shadow-2xl"
                />
              ) : previewAsset.fileType === 'image' ? (
                <img
                  src={previewAsset.url}
                  alt={previewAsset.fileName}
                  className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-2xl"
                />
              ) : (
                <div className="p-12 text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400">
                    <FolderArchive className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-200">{previewAsset.fileName}</h4>
                  <p className="text-xs text-zinc-400">
                    Direct binary file. Click the download button above to access the source asset.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD ASSET MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80">
          <form
            onSubmit={handleUploadSubmit}
            className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-400" />
                <span>Upload Creative Asset</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Asset File Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex_Primary_Vector_Logo.svg"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">
                  File URL / Cloud Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="drive.google.com/... or cloud media URL"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Asset Type</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200"
                  >
                    <option value="image">Image (PNG, JPG, SVG)</option>
                    <option value="video">Video (MP4, MOV)</option>
                    <option value="design_file">Design File (Figma, PSD)</option>
                    <option value="document">Document (PDF)</option>
                    <option value="archive">Archive (ZIP)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200"
                  >
                    <option value="brand_asset">Brand Asset</option>
                    <option value="raw_footage">Raw Footage</option>
                    <option value="deliverable">Deliverable</option>
                    <option value="reference">Reference / Moodboard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">
                  Associated Client Brand
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200"
                >
                  <option value="">Global / Unassigned</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/30"
              >
                Upload to Library
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
