import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import Modal from '../../../components/ui/Modal';
import AuditDetailModal from '../../../components/dashboard/audit/AuditDetailModal';
import { getAllNews, approveNews, rejectNews, deleteNews } from '../../../services/newsService';
import { NEWS_STATUS } from '../../../lib/constants';
import { toast } from 'react-toastify';
import useAuth from '../../../context/useAuth';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';
import { formatDate } from '../../../lib/utils';

const NewsModeration = () => {
  useAuth();
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, title }

  // Fetch pending (awaiting approval) news articles directly
  const { data: pendingNews = [], isLoading: loadingPending } = useQuery({
    queryKey: ['news', 'pending'],
    queryFn: () => getAllNews({ status: NEWS_STATUS.PENDING })
  });

  // Fetch published news articles
  const { data: publishedNews = [], isLoading: loadingPublished } = useQuery({
    queryKey: ['news', 'published'],
    queryFn: () => getAllNews({ status: NEWS_STATUS.PUBLISHED })
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['news', 'pending'] });
    queryClient.invalidateQueries({ queryKey: ['news', 'published'] });
    queryClient.invalidateQueries({ queryKey: ['activityLog'] });
  };

  const approveMutation = useMutation({
    mutationFn: (notes) => approveNews(selectedItem.id, { notes }),
    onSuccess: () => {
      toast.success('Article approved and published');
      invalidate();
      setSelectedItem(null);
    },
    onError: (error) => toast.error(error?.message || 'Unable to approve article')
  });

  const rejectMutation = useMutation({
    mutationFn: (notes) => rejectNews(selectedItem.id, { notes }),
    onSuccess: () => {
      toast.info('Article sent back to author');
      invalidate();
      setSelectedItem(null);
    },
    onError: (error) => toast.error(error?.message || 'Unable to reject article')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteNews(id),
    onSuccess: () => {
      toast.success('Article deleted');
      setDeleteConfirm(null);
      invalidate();
    },
    onError: (error) => {
      toast.error(error?.message || 'Unable to delete article');
      setDeleteConfirm(null);
    }
  });

  const handleDeleteClick = (article) => {
    setDeleteConfirm({ id: article.id, title: article.title });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm) {
      deleteMutation.mutate(deleteConfirm.id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gov-gray-900">News Moderation</h1>
        <p className="text-gov-gray-600 mt-1">
          Approve newsroom submissions and keep published content compliant and up-to-date.
        </p>
      </div>

      <Card className="p-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gov-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gov-gray-900">Pending approval</h2>
            <p className="text-sm text-gov-gray-600">
              Review each story to ensure accuracy before publication.
            </p>
          </div>
          <Badge variant="yellow">{pendingNews.length} awaiting review</Badge>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Category</Table.HeaderCell>
                <Table.HeaderCell>Submitted</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Action</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {loadingPending ? (
                <Table.Row>
                  <Table.Cell colSpan={4}>
                    <Skeleton rows={4} />
                  </Table.Cell>
                </Table.Row>
              ) : pendingNews.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={4} className="py-6">
                    <EmptyState title="No pending submissions" description="No articles are awaiting moderation." />
                  </Table.Cell>
                </Table.Row>
              ) : (
                pendingNews.map((article) => (
                  <Table.Row key={article.id}>
                    <Table.Cell>
                      <div className="space-y-1">
                        <p className="font-medium text-gov-gray-900">{article.title || 'Untitled article'}</p>
                        <p className="text-xs text-gov-gray-500">{article.summary || 'No summary provided'}</p>
                      </div>
                    </Table.Cell>
                    <Table.Cell>{article.category || '—'}</Table.Cell>
                    <Table.Cell>{article.submittedAt ? formatDate(article.submittedAt) : '—'}</Table.Cell>
                    <Table.Cell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => setSelectedItem({
                          id: article.id,
                          entityType: 'news',
                          entityName: article.title,
                          submittedByName: article.authorName,
                          submittedById: article.authorId,
                          submittedAt: article.submittedAt || article.updatedAt,
                          status: NEWS_STATUS.PENDING,
                          payload: { article }
                        })}
                      >
                        Review
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      </Card>

      <Card className="p-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gov-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gov-gray-900">Published articles</h2>
            <p className="text-sm text-gov-gray-600">Recently approved stories currently live on the site.</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['news', 'published'] })}
          >
            Refresh list
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Category</Table.HeaderCell>
                <Table.HeaderCell>Published</Table.HeaderCell>
                <Table.HeaderCell>Submitted</Table.HeaderCell>
                <Table.HeaderCell>Author</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {loadingPublished ? (
                <Table.Row>
                  <Table.Cell colSpan={4}>
                    <Skeleton rows={4} />
                  </Table.Cell>
                </Table.Row>
              ) : publishedNews.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={4} className="py-6">
                    <EmptyState title="No published articles" description="No articles have been published yet." />
                  </Table.Cell>
                </Table.Row>
              ) : (
                publishedNews.map((article) => (
                  <Table.Row key={article.id}>
                    <Table.Cell>
                      <div className="space-y-1">
                        <p className="font-medium text-gov-gray-900">{article.title}</p>
                        <p className="text-xs text-gov-gray-500">{article.summary}</p>
                      </div>
                    </Table.Cell>
                    <Table.Cell>{article.category}</Table.Cell>
                    <Table.Cell>{formatDate(article.publishedAt)}</Table.Cell>
                    <Table.Cell>{formatDate(article.submittedAt || article.createdAt)}</Table.Cell>
                    <Table.Cell>{article.authorName || 'Media Team'}</Table.Cell>
                    <Table.Cell className="text-right space-x-2">
                      <Button as={Link} to={`/news-and-updates/${article.slug || article.id}`} variant="outline" size="sm" target="_blank" rel="noopener noreferrer">
                        View
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        disabled={deleteMutation.isPending && deleteConfirm?.id === article.id}
                        onClick={() => handleDeleteClick(article)}
                      >
                        {deleteMutation.isPending && deleteConfirm?.id === article.id ? 'Deleting…' : 'Delete'}
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      </Card>

      <AuditDetailModal
        item={selectedItem}
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        onApprove={(notes) => approveMutation.mutate(notes)}
        onReject={(notes) => rejectMutation.mutate(notes)}
        isApproving={approveMutation.isPending}
        isRejecting={rejectMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Article"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gov-gray-700">
            Are you sure you want to delete <strong>{deleteConfirm?.title}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="ghost"
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete Article'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NewsModeration;
