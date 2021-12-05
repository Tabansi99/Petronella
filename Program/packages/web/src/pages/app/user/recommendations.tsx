import {
  Box,
  Grid,
  Heading,
  ButtonGroup,
  Text,
  Button,
  HStack,
  VStack,
  Collapse,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { Destination, DestinationCard } from '../../../components/utils/destinationCard';
import React, { useEffect, useState } from 'react';
import { ApplicationLayout } from '../../../components/utils/applicationLayout';

const Recommendations = () => {
  const [destinations, setDestination] = useState<any[]>([]);
  const [preference, setPreference] = useState('normal');
  const [warm, setWarm] = useState('white');
  const [normal, setNormal] = useState('gray.200');
  const [cold, setCold] = useState('white');

  useEffect(() => {
    const fetchStuff = async () => {
      await fetch('/api/recommendations/' + preference)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Failed');
          }
        })
        .then((data) => {
          setDestination(data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchStuff();
  }, [preference]);

  const destinationCards: Array<Destination> = [];

  for (let i = 0; i < destinations.length; i++) {
    destinationCards.push({
      destinationCity: destinations[i].city,
      destinationRegion: destinations[i].region,
      destinationCountry: destinations[i].country,
      destinationContinent: destinations[i].continent,
      destinationLatitude: Number(destinations[i].latitude),
      destinationLongitude: Number(destinations[i].longitude),
      rating: i,
    });
  }

  return (
    <ApplicationLayout>
      <Box pb={3}>
        <HStack justify="space-between" align="top">
          <Box>
            <Heading fontStyle="italic">We pick the best for our guests</Heading>

            <Text as="i">
              Based on your travel history, we thought you would like these destinations!
            </Text>
          </Box>

          <VStack width="500px">
            <Heading size="md">Give us more context...</Heading>
            <Text fontStyle="italic">What climate do you typically prefer?</Text>
            <Box display="inline">
              <ButtonGroup isAttached>
                <Button
                  background={cold}
                  onClick={() => {
                    setCold('blue.300');
                    setNormal('white');
                    setWarm('white');
                    setPreference('cold');
                  }}
                  borderRadius="xl"
                >
                  Cold
                </Button>
                <Button
                  background={normal}
                  onClick={() => {
                    setCold('white');
                    setNormal('gray.200');
                    setWarm('white');
                    setPreference('normal');
                  }}
                >
                  None
                </Button>
                <Button
                  background={warm}
                  onClick={(event) => {
                    setCold('white');
                    setNormal('white');
                    setWarm('red.200');
                    setPreference('warm');
                  }}
                  borderRadius="xl"
                >
                  Warm
                </Button>
              </ButtonGroup>
            </Box>

            <Collapse in={preference !== 'normal'} animateOpacity>
              <Alert pt={2} status="info">
                <AlertIcon />
                Based on users with similiar climate preferences, we thought you would also like
                these destinations...
              </Alert>
            </Collapse>
          </VStack>
        </HStack>
      </Box>

      <Box>
        <Grid templateColumns="repeat(6, 1fr)" gap={6}>
          {destinationCards.map((dest) => (
            <DestinationCard
              key={dest.destinationCity}
              destinationCity={dest.destinationCity}
              destinationRegion={dest.destinationRegion}
              destinationCountry={dest.destinationCountry}
              destinationContinent={dest.destinationContinent}
              destinationLatitude={dest.destinationLatitude}
              destinationLongitude={dest.destinationLongitude}
              rating={dest.rating}
            />
          ))}
        </Grid>
      </Box>
    </ApplicationLayout>
  );
};

export default Recommendations;
