import Card from '../../../components/ui/Card';
import { NewspaperIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const MediaDashboard = () => {
  // TODO: Replace with actual data
  const stats = [
    { name: 'Published Articles', value: '45', icon: NewspaperIcon },
    { name: 'Draft Articles', value: '8', icon: DocumentTextIcon }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gov-gray-900">
          Media Dashboard
        </h1>
        <p className="text-gov-gray-600 mt-1">
          Manage news articles and publications
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gov-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-gov-blue-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gov-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gov-gray-600">
                    {stat.name}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gov-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            to="/dashboard/news-editor"
            className="flex items-center justify-center p-4 bg-gov-blue-50 rounded-lg hover:bg-gov-blue-100 transition-colors"
          >
            <NewspaperIcon className="w-6 h-6 text-gov-blue-600 mr-2" />
            <span className="font-medium">Create New Article</span>
          </Link>
          <Link 
            to="/dashboard/drafts"
            className="flex items-center justify-center p-4 bg-gov-gray-100 rounded-lg hover:bg-gov-gray-200 transition-colors"
          >
            <DocumentTextIcon className="w-6 h-6 text-gov-gray-600 mr-2" />
            <span className="font-medium">View Drafts</span>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default MediaDashboard;
