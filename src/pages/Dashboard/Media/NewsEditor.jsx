import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import NewsEditorForm from '../../../components/dashboard/news/NewsEditorForm';
import Card from '../../../components/ui/Card';
import Loader from '../../../components/ui/Loader';
import useAuth from '../../../context/useAuth';
import {
  getNewsById,
  saveNewsDraft,
  submitNewsForApproval
} from '../../../services/newsService';
import Button from '../../../components/ui/Button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const NewsEditor = () => {
  const { newsId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: article, isLoading } = useQuery({
    queryKey: ['news', newsId || 'new'],
    queryFn: () => (newsId ? getNewsById(newsId) : Promise.resolve(null)),
    enabled: Boolean(newsId)
  });

  useEffect(() => {
    if (newsId && !isLoading && article === null) {
      toast.error('Requested article could not be found');
      navigate('/dashboard/drafts', { replace: true });
    }
  }, [newsId, article, isLoading, navigate]);

  const invalidateLists = () => {
    queryClient.invalidateQueries({ queryKey: ['news'] });
    queryClient.invalidateQueries({ queryKey: ['news', 'drafts'] });
    queryClient.invalidateQueries({ queryKey: ['auditQueue'] });
    queryClient.invalidateQueries({ queryKey: ['activityLog'] });
  };

  const saveDraftMutation = useMutation({
    mutationFn: (values) => saveNewsDraft({ ...values }, user),
    onSuccess: (draft) => {
      toast.success('Draft saved');
      invalidateLists();
      if (!newsId) {
        navigate(`/dashboard/news-editor/${draft.id}`, { replace: true });
      }
    },
    onError: (error) => {
      console.error('Save draft error:', error);
      
      // Handle specific HTTP status codes
      if (error?.response?.status === 403) {
        toast.error('You do not have permission to create/edit news articles');
      } else if (error?.response?.status === 500) {
        toast.error('Server error. Please try again later');
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error?.message || 'Unable to save draft');
      }
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (values) => {
      const draft = await saveNewsDraft({ ...values }, user);
      await submitNewsForApproval(draft.id, { actor: user });
      return draft;
    },
    onSuccess: () => {
      // Check if user is SUPER_ADMIN or ADMIN (auto-approved)
      if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') {
        toast.success('Article published successfully');
      } else {
        toast.success('Article submitted for approval');
      }
      invalidateLists();
      navigate('/dashboard/drafts');
    },
    onError: (error) => {
      console.error('Submit error:', error);
      
      // Handle specific HTTP status codes
      if (error?.response?.status === 403) {
        toast.error('You do not have permission to submit news articles');
      } else if (error?.response?.status === 500) {
        toast.error('Server error. Please try again later');
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error?.message || 'Unable to submit for approval');
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <Loader size="lg" label="Loading article" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gov-gray-900">
            {newsId ? 'Edit Article' : 'Create News Article'}
          </h1>
          <p className="text-gov-gray-600 mt-1">
            Write, save, and submit news stories for super admin approval.
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard/drafts')}
          className="inline-flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to drafts
        </Button>
      </div>

      <Card className="p-0">
        <NewsEditorForm
          article={article || undefined}
          isSaving={saveDraftMutation.isPending}
          isSubmitting={submitMutation.isPending}
          onSaveDraft={saveDraftMutation.mutateAsync}
          onSubmitForApproval={submitMutation.mutateAsync}
        />
      </Card>
    </div>
  );
};

export default NewsEditor;
