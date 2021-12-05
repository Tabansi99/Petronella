import React, { useEffect, useState, ReactNode } from 'react';
import { Box, Grid, Link, Button, Heading, Text, HStack, Image, Checkbox } from '@chakra-ui/react';
import { Flight, FlightCard } from '../../../components/utils/flightCard';
import { ApplicationLayout } from '../../../components/utils/applicationLayout';
import { GoogleMap, InfoWindow, Marker, useLoadScript } from '@react-google-maps/api';
import { Destination, DestinationCard } from '../../../components/utils/destinationCard';

var FlightHistoryButton;
let pastFlights: boolean = true;

const Dashboard = () => {
  const [destinations, setDestination] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [first, setFirst] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight>();
  const [selectedDestination, setSelectedDestination] = useState<Destination>();
  const [preference, setPreference] = useState('normal');
  const [checkPastFlight, setPast] = useState(true);
  const [checkHighRecFlight, setHighRec] = useState(true);
  const [checkRecFlight, setRec] = useState(true);

  useEffect(() => {
    const fetchStuff = async () => {
      await fetch('/api/flights/')
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
  }, [first]);

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
          setRecommendations(data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchStuff();
  }, [preference]);

  const destinationCards: Array<Flight> = [];
  const pins: Array<Flight> = [];
  if (destinations.length == 0) {
    FlightHistoryButton = 'Add a flight...';
    pastFlights = false;
  } else {
    FlightHistoryButton = 'Flight History';
    pastFlights = true;
  }

  for (let i = 0; i < destinations.length; i++) {
    destinationCards.push({
      flightDate: destinations[i].flightDate,
      departureCity: destinations[i].departureCity,
      destinationCity: destinations[i].destination.city,
      destinationRegion: destinations[i].destination.region,
      destinationCountry: destinations[i].destination.country,
      destinationContinent: destinations[i].destination.continent,
      destinationLatitude: Number(destinations[i].destination.latitude),
      destinationLongitude: Number(destinations[i].destination.longitude),
    });

    pins.push({
      flightDate: destinations[i].flightDate,
      departureCity: destinations[i].departureCity,
      destinationCity: destinations[i].destination.city,
      destinationRegion: destinations[i].destination.region,
      destinationCountry: destinations[i].destination.country,
      destinationContinent: destinations[i].destination.continent,
      destinationLatitude: Number(destinations[i].destination.latitude),
      destinationLongitude: Number(destinations[i].destination.longitude),
    });
  }

  const recommendationCards: Array<Destination> = [];
  const recommendationPins: Array<Destination> = [];

  for (let i = 0; i < recommendations.length; i++) {
    recommendationCards.push({
      destinationCity: recommendations[i].city,
      destinationRegion: recommendations[i].region,
      destinationCountry: recommendations[i].country,
      destinationContinent: recommendations[i].continent,
      destinationLatitude: Number(recommendations[i].latitude),
      destinationLongitude: Number(recommendations[i].longitude),
      rating: i,
    });

    if (i < 20) {
      recommendationPins.push({
        destinationCity: recommendations[i].city,
        destinationRegion: recommendations[i].region,
        destinationCountry: recommendations[i].country,
        destinationContinent: recommendations[i].continent,
        destinationLatitude: Number(recommendations[i].latitude),
        destinationLongitude: Number(recommendations[i].longitude),
        rating: i,
      });
    }
  }

  const highRecPins: Array<Destination> = recommendationPins.splice(0, 5);

  if (pastFlights) {
    return (
      <ApplicationLayout>
        <Box pb={5}>
          <Heading>
            <Text as="i">Your recent flights</Text>
          </Heading>
        </Box>
        <Box>
          <Grid templateColumns="repeat(6, 1fr)" gap={6}>
            {destinationCards.splice(0, 6).map((dest) => (
              <FlightCard
                key={dest.destinationCity + '_' + dest.flightDate}
                flightDate={dest.flightDate}
                departureCity={dest.departureCity}
                destinationCity={dest.destinationCity}
                destinationRegion={dest.destinationRegion}
                destinationCountry={dest.destinationCountry}
                destinationContinent={dest.destinationContinent}
                destinationLatitude={dest.destinationLatitude}
                destinationLongitude={dest.destinationLongitude}
              />
            ))}
          </Grid>

          <Box textAlign="left" mt={4} mb={4}>
            <Link href="/app/user/flightHistory" style={{ textDecoration: 'none' }}>
              <Button
                background="blue.600"
                _hover={{ color: 'white', bg: 'cyan.400' }}
                color="white"
              >
                {FlightHistoryButton}
              </Button>
            </Link>
          </Box>

          <Box pb={5}>
            <Heading>
              <Text as="i">Destinations you may also enjoy</Text>
            </Heading>
          </Box>

          <Grid templateColumns="repeat(6, 1fr)" gap={6}>
            {recommendationCards.splice(0, 6).map((dest) => (
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

          <Box textAlign="left" mt={4}>
            <Link href="/app/user/recommendations" style={{ textDecoration: 'none' }}>
              <Button
                background="blue.600"
                _hover={{ color: 'white', bg: 'cyan.400' }}
                color="white"
              >
                Recommendations
              </Button>
            </Link>
          </Box>
        </Box>

        <Box mt={4}>
          <Heading>
            <Text as="i">Your flight overview</Text>
          </Heading>
          <Text mt={2} fontSize="xl">
            Legend/Filter
          </Text>
          <HStack mt={2} textAlign="left">
            <Box>
              <HStack>
                <Box>
                  <Checkbox
                    size="md"
                    colorScheme="green"
                    isChecked={checkPastFlight}
                    onChange={(e) => setPast(e.target.checked)}
                  >
                    Previous Flights
                  </Checkbox>
                </Box>
                <Box>
                  <Image src="http://maps.google.com/mapfiles/ms/icons/green-dot.png" />
                </Box>
              </HStack>
            </Box>
            <Box>
              <HStack>
                <Box>
                  <Checkbox
                    size="md"
                    colorScheme="pink"
                    isChecked={checkHighRecFlight}
                    onChange={(e) => setHighRec(e.target.checked)}
                  >
                    Highly Recommended Flights
                  </Checkbox>
                </Box>
                <Box>
                  <Image src="http://maps.google.com/mapfiles/ms/icons/pink-dot.png" />
                </Box>
              </HStack>
            </Box>
            <Box>
              <HStack>
                <Box>
                  <Checkbox
                    size="md"
                    colorScheme="yellow"
                    isChecked={checkRecFlight}
                    onChange={(e) => setRec(e.target.checked)}
                  >
                    Recommended Flights
                  </Checkbox>
                </Box>
                <Box>
                  <Image src="http://maps.google.com/mapfiles/ms/icons/yellow-dot.png" />
                </Box>
              </HStack>
            </Box>
          </HStack>
        </Box>

        <Box mt={4} borderRadius="xl" overflow="hidden">
          <FlightMap selectedFlight={selectedFlight} selectedDestination={selectedDestination}>
            {checkPastFlight
              ? pins.map((destination) => (
                  <Marker
                    key={destination.destinationLatitude + '_' + destination.destinationLongitude}
                    data-testid={destination.destinationCity + ' Pin'}
                    position={{
                      lat: destination.destinationLatitude,
                      lng: destination.destinationLongitude,
                    }}
                    onClick={() => {
                      setSelectedFlight(destination);
                    }}
                    icon={{
                      url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                    }}
                  />
                ))
              : null}

            {checkHighRecFlight
              ? highRecPins.map((recommendation) => (
                  <Marker
                    key={
                      recommendation.destinationLatitude + '_' + recommendation.destinationLongitude
                    }
                    data-testid={recommendation.destinationCity + ' Pin'}
                    position={{
                      lat: recommendation.destinationLatitude,
                      lng: recommendation.destinationLongitude,
                    }}
                    onClick={() => {
                      setSelectedDestination(recommendation);
                    }}
                    icon={{
                      url: 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png',
                    }}
                  />
                ))
              : null}

            {checkRecFlight
              ? recommendationPins.map((recommendation) => (
                  <Marker
                    key={
                      recommendation.destinationLatitude + '_' + recommendation.destinationLongitude
                    }
                    data-testid={recommendation.destinationCity + ' Pin'}
                    position={{
                      lat: recommendation.destinationLatitude,
                      lng: recommendation.destinationLongitude,
                    }}
                    onClick={() => {
                      setSelectedDestination(recommendation);
                    }}
                    icon={{
                      url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
                    }}
                  />
                ))
              : null}

            {selectedFlight ? (
              <InfoWindow
                position={{
                  lat: selectedFlight.destinationLatitude,
                  lng: selectedFlight.destinationLongitude,
                }}
                onCloseClick={() => {
                  setSelectedFlight(undefined);
                }}
              >
                <FlightCard
                  key={
                    selectedFlight.destinationCity + '_' + selectedFlight.flightDate + '_SELECTED'
                  }
                  flightDate={selectedFlight.flightDate}
                  departureCity={selectedFlight.departureCity}
                  destinationCity={selectedFlight.destinationCity}
                  destinationRegion={selectedFlight.destinationRegion}
                  destinationCountry={selectedFlight.destinationCountry}
                  destinationContinent={selectedFlight.destinationContinent}
                  destinationLatitude={selectedFlight.destinationLatitude}
                  destinationLongitude={selectedFlight.destinationLongitude}
                />
              </InfoWindow>
            ) : null}

            {selectedDestination ? (
              <InfoWindow
                position={{
                  lat: selectedDestination.destinationLatitude,
                  lng: selectedDestination.destinationLongitude,
                }}
                onCloseClick={() => {
                  setSelectedDestination(undefined);
                }}
              >
                <DestinationCard
                  key={selectedDestination.destinationCity + '_SELECTED'}
                  destinationCity={selectedDestination.destinationCity}
                  destinationRegion={selectedDestination.destinationRegion}
                  destinationCountry={selectedDestination.destinationCountry}
                  destinationContinent={selectedDestination.destinationContinent}
                  destinationLatitude={selectedDestination.destinationLatitude}
                  destinationLongitude={selectedDestination.destinationLongitude}
                  rating={selectedDestination.rating}
                />
              </InfoWindow>
            ) : null}
          </FlightMap>
        </Box>
      </ApplicationLayout>
    );
  } else {
    return (
      <ApplicationLayout>
        <Box pb={5}>
          <Heading>
            <Text as="i">Your recent flights</Text>
          </Heading>
        </Box>
        <Box>
          <Box textAlign="left" mt={4} mb={4}>
            <Link href="/app/user/flightHistory" style={{ textDecoration: 'none' }}>
              <Button
                background="blue.600"
                _hover={{ color: 'white', bg: 'cyan.400' }}
                color="white"
              >
                {FlightHistoryButton}
              </Button>
            </Link>
          </Box>
        </Box>
      </ApplicationLayout>
    );
  }
};

export const FlightMap = ({
  children,
  selectedFlight,
  selectedDestination,
}: {
  children: ReactNode;
  selectedFlight: Flight | undefined;
  selectedDestination: Destination | undefined;
}) => {
  const mapContainerStyle = {
    width: '100%',
    height: '75vh',
  };

  var center = {
    lat: 0,
    lng: 0,
  };

  var zoom = 3;

  if (selectedFlight) {
    center = {
      lat: selectedFlight.destinationLatitude,
      lng: selectedFlight.destinationLongitude,
    };
    zoom = 7;
  } else if (selectedDestination) {
    center = {
      lat: selectedDestination.destinationLatitude,
      lng: selectedDestination.destinationLongitude,
    };
    zoom = 7;
  }

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCUVvr3G9c256nTXEJVkYb23szgEaSVnYk',
  });

  /* istanbul ignore next */
  if (loadError) return <p>Error loading map</p>;
  /* istanbul ignore next */
  if (!isLoaded) return <p>Loading Maps</p>;

  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} zoom={zoom} center={center}>
      {children}
    </GoogleMap>
  );
};

export default Dashboard;
