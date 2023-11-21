/**
 * Project vite (base-components)
 */

import Shimmer from '@/components/ui/shimmer';

/**
 * LoaderForm component
 */
const LoaderForm = () => (
  <div className="flex-column" data-testid="loader-form">
    <Shimmer height={22} width="30%" />
    <Shimmer height={14} width="100%" />
    <Shimmer height={14} width="100%" />
    <Shimmer height={18} width="50%" />
    <Shimmer height={18} width="60%" />
    <Shimmer height={18} width="70%" />
    <Shimmer height={80} width="100%" />
    <Shimmer height={18} width="100%" />
  </div>
);

export default LoaderForm;
