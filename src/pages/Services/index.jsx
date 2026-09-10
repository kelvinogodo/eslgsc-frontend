import { 
  AcademicCapIcon, 
  BanknotesIcon, 
  UsersIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import PageHero from '../../components/common/PageHero';
import Button from '../../components/ui/Button';

const Services = () => {
  const categories = [
    { value: 'all', label: 'All Services' },
    { value: 'seminars', label: 'Seminars & Training' },
    { value: 'grants', label: 'Grants & Funding' },
    { value: 'programs', label: 'Community Programs' },
    { value: 'advocacy', label: 'Public Advocacy' },
    { value: 'policy', label: 'Policies & Circulars' }
  ];

  const services = [
    {
      category: 'seminars',
      icon: AcademicCapIcon,
      title: 'Professional Capacity Building',
      description: 'Comprehensive training programs designed to enhance the administrative skills and competencies of local government personnel.',
      features: [
        'Leadership development workshops',
        'Technical skills enhancement',
        'Professional certification programs',
        'E-governance training'
      ]
    },
    {
      category: 'seminars',
      icon: AcademicCapIcon,
      title: 'Capacity Building Seminars',
      description: 'Regular seminars focused on modern governance practices and service delivery excellence.',
      features: [
        'Quarterly thematic seminars',
        'Best practices sharing sessions',
        'Inter-LGA collaboration forums',
        'Expert-led masterclasses'
      ]
    },
    {
      category: 'grants',
      icon: BanknotesIcon,
      title: 'Community Development Grants',
      description: 'Financial support for community-driven development projects across local governments.',
      features: [
        'Infrastructure development funding',
        'Healthcare facility grants',
        'Education sector support',
        'Agricultural enhancement programs'
      ]
    },
    {
      category: 'grants',
      icon: BanknotesIcon,
      title: 'Youth Empowerment Fund',
      description: 'Targeted financial assistance for youth-led initiatives and entrepreneurship programs.',
      features: [
        'Start-up capital for young entrepreneurs',
        'Skills acquisition support',
        'Technology innovation grants',
        'Youth cooperative funding'
      ]
    },
    {
      category: 'programs',
      icon: UsersIcon,
      title: 'Local Governance Reform Programme',
      description: 'Enhancing administrative frameworks for rural local governments.',
      features: [
        'Modern governance frameworks',
        'Service delivery standards',
        'LGA performance monitoring',
        'Citizen engagement protocols'
      ]
    },
    {
      category: 'programs',
      icon: BuildingOfficeIcon,
      title: 'Community Revitalization Scheme',
      description: 'Holistic approach to revitalizing communities through integrated development.',
      features: [
        'Infrastructure rehabilitation',
        'Sanitation improvement projects',
        'Public space enhancement',
        'Community engagement programs'
      ]
    },
    {
      category: 'advocacy',
      icon: ClipboardDocumentCheckIcon,
      title: 'Public Sector Advocacy',
      description: 'Promoting excellence and transparency across local government institutions.',
      features: [
        'Governance ethics workshops',
        'Citizen engagement initiatives',
        'Transparency audits',
        'Public interest advocacy'
      ]
    },
    {
      category: 'policy',
      icon: DocumentTextIcon,
      title: 'Official Circulars & Policy Guides',
      description: 'Public access to official directives and policy implementation guidelines.',
      features: [
        'Verified administrative circulars',
        'Policy implementation guides',
        'Gazette publication access',
        'Governance reform documentation'
      ]
    }
  ];

  const serviceGroups = categories.map((category) => ({
    ...category,
    items:
      category.value === 'all'
        ? services
        : services.filter((service) => service.category === category.value)
  }));

  const serviceHighlights = [
    {
      title: 'Transparent Processes',
      description: 'Every programme is guided by published criteria, peer review, and continuous monitoring to keep communities informed and engaged.'
    },
    {
      title: 'Human-centred Delivery',
      description: 'We prioritise professional excellence, citizen experience, and inclusive access when designing and executing local government services.'
    },
    {
      title: 'Data-driven Oversight',
      description: 'Insights from our analytics team help us deploy resources where they matter most and measure the impact of every intervention.'
    }
  ];

  const renderServiceCard = (service) => {
    const Icon = service.icon;

    return (
      <Card key={service.title} className="p-6 h-full flex flex-col gap-4 hover:shadow-lg transition-shadow" role="listitem">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-14 h-14 bg-gov-blue-100 rounded-lg flex items-center justify-center">
            <Icon className="w-7 h-7 text-gov-blue-600" aria-hidden="true" />
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gov-gray-900 text-balance">
                {service.title}
              </h3>
              <p className="text-gov-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
            <ul className="space-y-2" role="list">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-gov-gray-600">
                  <CheckCircleIcon className="w-5 h-5 text-gov-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="pb-16">
      <PageHero
        eyebrow="Service Catalogue"
        title="Supporting every local government mission"
        description="From administrative development and public advocacy to community revitalisation, our programmes keep Ebonyi State’s local governments equipped to serve residents with excellence."
        actions={
          <Button as={Link} to="/contact" variant="primary" size="lg">
            Talk to our service desk
          </Button>
        }
      />

      <section className="py-12 bg-white" aria-labelledby="service-highlights-heading">
        <div className="container-custom">
          <div className="max-w-3xl space-y-3">
            <h2 id="service-highlights-heading" className="heading-lg text-balance">
              How we deliver impact
            </h2>
            <p className="text-gov-gray-600 leading-relaxed">
              Each initiative is grounded in governance best practice—rooted in fairness, measurable results, and genuine collaboration with stakeholders in every Local Government Area.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8" role="list">
            {serviceHighlights.map((highlight) => (
              <Card key={highlight.title} className="p-6 h-full" role="listitem">
                <h3 className="heading-sm mb-3 text-gov-blue-800">
                  {highlight.title}
                </h3>
                <p className="text-sm text-gov-gray-600 leading-relaxed">
                  {highlight.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 bg-gov-gray-50" aria-labelledby="service-catalog-heading">
        <div className="container-custom space-y-8">
          <div className="max-w-3xl space-y-3">
            <h2 id="service-catalog-heading" className="heading-lg text-balance">
              Explore programme categories
            </h2>
            <p className="text-gov-gray-600 leading-relaxed">
              Browse by initiative type to understand the objectives, beneficiary groups, and key deliverables for every Commission-led service.
            </p>
          </div>

          <Tabs tabs={serviceGroups.map(({ value, label }) => ({ value, label }))}>
            {serviceGroups.map((group) => (
              <Tabs.Panel key={group.value}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8" role="list">
                  {group.items.map((service) => renderServiceCard(service))}
                </div>
              </Tabs.Panel>
            ))}
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gov-blue-600 text-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="heading-lg text-white text-balance">Need tailored support for your LGA?</h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Our service desk partners with directors of administration, planning officers, and administrative leads to co-create implementation plans that match each community’s priorities.
            </p>
            <div className="flex justify-center flex-wrap gap-3">
              <Button
                as={Link}
                to="/contact"
                size="lg"
                className="bg-white text-gov-blue-700 hover:bg-gov-gray-100"
              >
                Get in touch
              </Button>
              <Button
                as={Link}
                to="/faq"
                size="lg"
                variant="ghost"
                className="text-white border border-white/60 hover:bg-white/10"
              >
                Visit the FAQ
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
