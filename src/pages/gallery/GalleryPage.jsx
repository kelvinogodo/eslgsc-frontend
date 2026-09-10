import { useMemo, useState } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import PageHero from '../../components/common/PageHero';
import EmptyState from '../../components/ui/EmptyState';
import {
  CameraIcon,
  PhotoIcon,
  PlayCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const categories = [
  { value: 'all', label: 'All Moments' },
  { value: 'events', label: 'Official Events' },
  { value: 'community', label: 'Community Impact' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'infrastructure', label: 'Infrastructure' }
];

const galleryItems = [
  {
    id: 1,
    src: '/images/gallery/image1.jpg',
    title: 'Leadership Strategy Session',
    description: 'Executive leadership convened to co-create the 2025 service delivery agenda.',
    category: 'leadership'
  },
  {
    id: 2,
    src: '/images/gallery/image2.jpg',
    title: 'Capacity Building Workshop',
    description: 'Training facilitators engaging senior administrative officers in a digital governance module.',
    category: 'events'
  },
  {
    id: 3,
    src: '/images/gallery/image3.jpg',
    title: 'Community Outreach Program',
    description: 'Grassroots consultation with community leaders on inclusive service delivery.',
    category: 'community'
  },
  {
    id: 4,
    src: '/images/gallery/image4.jpg',
    title: 'Development Centres Showcase',
    description: 'Showcasing modern training facilities deployed across all development centres.',
    category: 'infrastructure'
  },
  {
    id: 5,
    src: '/images/gallery/image5.jpg',
    title: 'Training & Development Session',
    description: 'Professional development programs enhancing workforce capabilities.',
    category: 'events'
  },
  {
    id: 6,
    src: '/images/gallery/image6.jpg',
    title: 'ICT Infrastructure Launch',
    description: 'Launch of digital innovation labs and new service desks.',
    category: 'infrastructure'
  },
  {
    id: 7,
    src: '/images/gallery/image7.jpg',
    title: 'Youth Empowerment Initiative',
    description: 'Young professionals completing the public service mentorship programme.',
    category: 'community'
  },
  {
    id: 8,
    src: '/images/gallery/image8.jpg',
    title: 'Field Monitoring Exercise',
    description: 'Joint monitoring by ESLGSC and stakeholders to track project delivery.',
    category: 'events'
  },
  {
    id: 9,
    src: '/images/gallery/image9.jpg',
    title: 'Policy Development Workshop',
    description: 'Facilitators guiding officers through strategic planning workshops.',
    category: 'events'
  },
  {
    id: 10,
    src: '/images/gallery/image10.jpg',
    title: 'Women in Leadership Forum',
    description: 'Highlighting the leadership journey of women across Ebonyi LGAs.',
    category: 'community'
  },
  {
    id: 11,
    src: '/images/gallery/image11.jpg',
    title: 'Commission Headquarters',
    description: 'The ESLGSC complex—nerve centre for policy, HR, and reform initiatives.',
    category: 'infrastructure'
  },
  {
    id: 12,
    src: '/images/gallery/image12.jpg',
    title: 'Service Excellence Recognition',
    description: 'Recognising outstanding officers who exceeded service delivery benchmarks.',
    category: 'leadership'
  }
];

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return galleryItems;
    return galleryItems.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="pb-20 space-y-16">
      <PageHero
        eyebrow="Media Hub"
        title="Stories of transformation from Ebonyi’s local governments."
        description="Explore photo and video highlights from ESLGSC’s programmes, development centre activities, and community engagements. Each moment captures progress toward a responsive and people-focused public service."
        actions={
          <>
            <Button as="a" href="#collection" size="lg">
              View Collection
            </Button>
            <Button as="a" href="mailto:ebonyistatelgsc@gmail.com" variant="outline" size="lg">
              Submit Media
            </Button>
          </>
        }
      />

      <section className="container-custom">
        <Card className="p-8 bg-white/85 space-y-6">
          <div className="flex items-center gap-3">
            <PhotoIcon className="w-10 h-10 text-gov-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gov-gray-900">Media Quick Facts</h2>
              <p className="text-sm text-gov-gray-500">Snapshot of our growing archive</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-gov-gray-500">Images curated</p>
              <p className="text-3xl font-semibold text-gov-blue-700 mt-1">850+</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gov-gray-500">Video features</p>
              <p className="text-3xl font-semibold text-gov-blue-700 mt-1">65</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gov-gray-500">Annual storytelling projects</p>
              <p className="text-3xl font-semibold text-gov-blue-700 mt-1">18</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gov-gray-500">Community submissions</p>
              <p className="text-3xl font-semibold text-gov-blue-700 mt-1">220</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Filters */}
      <section id="collection" className="container-custom space-y-8">
        <div className="flex flex-wrap items-center gap-6 border-b border-gov-gray-100">
          {categories.map((category) => (
            <button
              key={category.value}
              className={`px-1 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 outline-none ${
                selectedCategory === category.value 
                ? 'border-gov-navy-600 text-gov-navy-900' 
                : 'border-transparent text-gov-gray-500 hover:text-gov-navy-600 hover:border-gov-gray-300'
              }`}
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.length === 0 ? (
            <div className="col-span-3">
              <EmptyState
                title="No media found"
                description="We couldn't find any items matching your selection. Try a different category or return to the gallery home."
                action={<Button as="a" href="/gallery" size="sm">View collection</Button>}
              />
            </div>
          ) : filteredItems.map((item) => (
            <Card key={item.id} className="group overflow-hidden relative">
              <div className="relative h-64 w-full">
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-[0.15em] text-white/90 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-sm border border-white/20 mb-2">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-white/80 leading-relaxed line-clamp-2">{item.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Media features */}
      <section className="bg-white py-16">
        <div className="container-custom grid gap-10 lg:grid-cols-[1fr_1fr] items-start">
          <Card className="p-8 space-y-6 bg-gradient-to-br from-gov-blue-600 to-gov-blue-800 text-white">
            <div className="flex items-center gap-3">
              <PlayCircleIcon className="w-10 h-10" />
              <div>
                <h2 className="text-2xl font-semibold">ESLGSC Video Library</h2>
                <p className="text-white/80 text-sm">Documentaries &amp; field stories</p>
              </div>
            </div>
            <p className="text-white/80">
              Watch mini-documentaries, project spotlights, and interviews with officers delivering grassroots services.
              curated monthly with subtitles and translation notes.
            </p>
            <Button
              as="a"
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              size="lg"
              className="bg-white text-gov-blue-700 hover:bg-gov-gray-100"
            >
              Open Video Library
            </Button>
          </Card>
          <Card className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <CameraIcon className="w-10 h-10 text-gov-blue-600" />
              <div>
                <h2 className="text-2xl font-semibold text-gov-gray-900">Media Collaboration Desk</h2>
                <p className="text-sm text-gov-gray-500">Partner with our communications team</p>
              </div>
            </div>
            <ul className="space-y-4 text-sm text-gov-gray-600">
              <li className="flex items-start gap-2">
                <SparklesIcon className="w-5 h-5 text-gov-blue-500 mt-0.5" />
                Co-produce features on reform milestones and citizen impact stories.
              </li>
              <li className="flex items-start gap-2">
                <SparklesIcon className="w-5 h-5 text-gov-blue-500 mt-0.5" />
                Access archival footage, infographics, and media briefs for reportage.
              </li>
              <li className="flex items-start gap-2">
                <SparklesIcon className="w-5 h-5 text-gov-blue-500 mt-0.5" />
                Invite ESLGSC spokespersons for expert commentary and civic education programmes.
              </li>
            </ul>
            <Button as="a" href="mailto:ebonyistatelgsc@gmail.com" variant="outline" size="lg">
              ebonyistatelgsc@gmail.com
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;