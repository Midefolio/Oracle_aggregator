import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

const CustomSkeleton = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} p={2}>
      <Skeleton variant="rectangular" width={'100%'} height={20} />
      <Skeleton variant="rectangular" animation="wave" width={'100%'} height={20} />
      <Skeleton variant="rectangular" animation={false} width={'100%'} height={20} />
    </Box>
  );
};

export default CustomSkeleton;
