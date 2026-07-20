import React from 'react';
import { Typography, Box, Card, CardContent } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body1">
            Welcome to the AgroLink Dashboard. The business features will be implemented here.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Home;
