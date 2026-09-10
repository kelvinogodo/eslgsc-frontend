import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Card from '../../ui/Card';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import Textarea from '../../ui/Textarea';
import Spinner from '../../ui/Spinner';
import NewsStatusBadge from './NewsStatusBadge';
import ImageUpload from './ImageUpload';
import { NEWS_STATUS } from '../../../lib/constants';

const categories = [
  { value: 'news', label: 'News Update' },
  { value: 'press-releases', label: 'Press Release' },
  { value: 'announcements', label: 'Announcement' },
  { value: 'speeches', label: 'Official Speech' },
  { value: 'notices', label: 'Public Notice' }
];

const defaultValues = {
  id: null,
  title: '',
  summary: '',
  content: '',
  category: categories[0].value,
  tags: '',
  imageUrl: ''
};

const NewsEditorForm = ({
  article,
  isSaving,
  isSubmitting,
  onSaveDraft,
  onSubmitForApproval
}) => {

  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues
  });

  useEffect(() => {
    register('content', { required: 'Content is required' });
  }, [register]);

  // Cloudinary image upload handler
  const handleImageUpload = async (file) => {
    setIsUploading(true);
    console.log('🚀 Uploading image to Cloudinary:', file.name, file.size);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'lwxo2qi3');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dkaeqvi72/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      console.log('✅ Image uploaded:', data.secure_url);
      setIsUploading(false);
      return data.secure_url;
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      setIsUploading(false);
      return null;
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false
      }),
      Image.configure({
        allowBase64: false, // Disable Base64 encoding
      }),
      Placeholder.configure({
        placeholder: 'Write the full story, add context, and format with headings…'
      })
    ],
    content: defaultValues.content,
    onUpdate({ editor: tiptap }) {
      setValue('content', tiptap.getHTML(), { shouldDirty: true });
    },
    editorProps: {
      // eslint-disable-next-line no-unused-vars
      handlePaste(view, event, _slice) {
        const items = Array.from(event.clipboardData?.items || []);
        const file = items.find(item => item.kind === 'file' && item.type.startsWith('image/'))?.getAsFile();

        if (file) {
          console.log('🖼️ Image Pasted (Robust):', file.name, file.type);
          event.preventDefault();
          event.stopPropagation();
          
          handleImageUpload(file).then(url => {
            if (url) {
              console.log('✅ Inserting image URL:', url);
              view.dispatch(view.state.tr.replaceSelectionWith(
                view.state.schema.nodes.image.create({ src: url })
              ));
            }
          });
          return true; // We handled it
        }
        return false; // Let Tiptap handle other pastes
      },
      // eslint-disable-next-line no-unused-vars
      handleDrop(view, event, _slice, _moved) {
        const files = Array.from(event.dataTransfer?.files || []);
        const file = files.find(f => f.type.startsWith('image/'));

        if (file) {
          console.log('🖼️ Image Dropped (Robust):', file.name, file.type);
          event.preventDefault();
          event.stopPropagation();
          
          handleImageUpload(file).then(url => {
            if (url) {
              console.log('✅ Inserting image URL:', url);
              const { state } = view;
              const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
              if (coords) {
                view.dispatch(state.tr.insert(coords.pos, 
                  state.schema.nodes.image.create({ src: url })
                ));
              }
            }
          });
          return true; // We handled it
        }
        return false; // Let Tiptap handle other drops
      }
    }
  });

  useEffect(() => {
    reset({ ...defaultValues, ...article });
    if (article?.content && editor) {
      editor.commands.setContent(article.content, false);
    }
    if (!article && editor) {
      editor.commands.clearContent();
    }
  }, [article, reset, editor]);

  const currentImage = watch('imageUrl');

  const handleImageChange = (url) => {
    setValue('imageUrl', url || '', { shouldDirty: true });
  };

  const normalizeTags = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean);
    return String(tags)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const onSave = handleSubmit(async (values) => {
    const payload = { ...values, tags: normalizeTags(values.tags) };
    await onSaveDraft?.(payload);
  });

  const onSubmitApproval = handleSubmit(async (values) => {
    const payload = { ...values, tags: normalizeTags(values.tags) };
    await onSubmitForApproval?.(payload);
  });

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-6">
        <div className="flex flex-wrap justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-gov-gray-500">Article status</p>
            <div className="mt-1">
              <NewsStatusBadge status={article?.status || NEWS_STATUS.DRAFT} />
            </div>
          </div>
          {article?.rejectionNotes && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 max-w-md">
              <p className="text-sm font-medium text-red-700">Revision requested</p>
              <p className="text-xs text-red-600 mt-1">{article.rejectionNotes}</p>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Input
              label="Headline"
              placeholder="Enter a clear, descriptive title"
              required
              error={errors.title?.message}
              {...register('title', { required: 'Title is required' })}
            />
            <Textarea
              label="Summary"
              rows={3}
              placeholder="Short summary shown on cards and previews"
              required
              error={errors.summary?.message}
              {...register('summary', { required: 'Summary is required' })}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-gov-gray-900">Full article</label>
              <Card className="p-0 overflow-hidden border-2 hover:border-gov-blue-500 focus-within:border-gov-blue-500 transition-colors">
                <div className="w-full overflow-hidden">
                  <EditorContent 
                    editor={editor} 
                    className="w-full min-h-[320px] focus-visible:outline-none 
                    prose prose-sm sm:prose-base max-w-none
                    [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[280px]
                    [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-3
                    [&_.ProseMirror]:w-full [&_.ProseMirror]:box-border
                    [&_.ProseMirror]:cursor-text
                    [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:h-auto [&_.ProseMirror_img]:display-block
                    [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-['Start_writing_your_article..._Paste_or_drag_images_directly_into_the_editor.']
                    [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400
                    [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left
                    [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none
                    [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0" 
                  />
                </div>
              </Card>
              {errors.content && (
                <p className="text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <Select
                label="Category"
                {...register('category', { required: 'Category is required' })}
                error={errors.category?.message}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Select>
              <Input
                label="Tags"
                placeholder="Comma-separated keywords"
                {...register('tags')}
              />
            </div>

            <ImageUpload value={currentImage} onChange={handleImageChange} />
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
        <Button type="button" variant="outline" onClick={onSave} disabled={isUploading || isSaving || isSubmitting}>
          {isUploading ? 'Uploading Image…' : (isSaving ? 'Saving…' : 'Save as Draft')}
        </Button>
        <Button type="button" onClick={onSubmitApproval} disabled={isUploading || isSubmitting || isSaving}>
          {isUploading ? 'Uploading Image…' : (isSubmitting ? 'Submitting…' : 'Submit for Approval')}
        </Button>
        {isUploading && (
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <Spinner size="sm" className="mr-2" label="Uploading image" />
            Please wait, image is uploading...
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsEditorForm;
