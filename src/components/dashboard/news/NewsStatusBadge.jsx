import Badge from '../../ui/Badge';
import { NEWS_STATUS } from '../../../lib/constants';

const statusVariantMap = {
  [NEWS_STATUS.DRAFT]: 'gray',
  [NEWS_STATUS.PENDING]: 'yellow',
  [NEWS_STATUS.PUBLISHED]: 'green',
  [NEWS_STATUS.ARCHIVED]: 'blue'
};

const labelMap = {
  [NEWS_STATUS.DRAFT]: 'Draft',
  [NEWS_STATUS.PENDING]: 'Pending approval',
  [NEWS_STATUS.PUBLISHED]: 'Published',
  [NEWS_STATUS.ARCHIVED]: 'Archived'
};

const NewsStatusBadge = ({ status }) => {
  if (!status) return null;
  return (
    <Badge variant={statusVariantMap[status] || 'gray'}>
      {labelMap[status] || status}
    </Badge>
  );
};

export default NewsStatusBadge;
