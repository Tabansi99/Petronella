import {
  Button,
  Box,
  useDisclosure,
  Grid,
  Modal,
  FormControl,
  FormLabel,
  Input,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  Heading,
  Text,
  Checkbox,
  Center,
  Select,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ApplicationLayout } from '../../../components/utils/applicationLayout';
import { Flight, FlightCard } from '../../../components/utils/flightCard';

const FlightHistory = () => {
  const [destinations, setDestination] = useState<any[]>([]);
  const [first, setFirst] = useState(false);

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

  var destinationCards: Array<Flight> = [];

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
  }

  return (
    <ApplicationLayout>
      <Box pb={5}>
        <Heading>
          <Text as="i">Your journey so far...</Text>
        </Heading>
      </Box>
      <Box>
        <Grid templateColumns="repeat(6, 1fr)" gap={6}>
          {destinationCards.map((dest) => (
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
        <AddFlight />
      </Box>
    </ApplicationLayout>
  );
};

const AddFlight = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');
  const [continent, setContinent] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [enjoyedFlight, setLiked] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchStuff = async () => {
      await fetch('/api/flights/continent/' + country)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Failed');
          }
        })
        .then((data) => {
          if (data.found) {
            setContinent(data.continent);
          } else {
            setContinent('');
          }
        })
        .catch((error) => {
          console.log(error);
          setContinent('');
        });
    };

    fetchStuff();
  }, [country]);

  const checkCity = async (event: EventTarget & HTMLInputElement) => {
    const dCity = event.value;
    if (dCity.length !== 0) {
      await fetch('/api/flights/check/' + dCity)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Failed');
          }
        })
        .then((data) => {
          if (data.exists) {
            setCity(data.city);
            setRegion(data.region);
            setCountry(data.country);
            setLatitude(data.latitude);
            setLongitude(data.longitude);
            event.value = data.city;
          } else {
            event.value = data.city;
            if (data.city !== '') {
              setCity(data.city);
              setRegion(data.region);
              setCountry(data.country);
              setLatitude(data.latitude);
              setLongitude(data.longitude);
            }
            alert(
              "Couldn't find location '" +
                dCity +
                "'." +
                '\n' +
                'Maybe: ' +
                data.city +
                ', ' +
                data.region +
                '. ' +
                data.country,
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setCity('');
      setRegion('');
      setCountry('');
      setLatitude(0);
      setLongitude(0);
    }
  };

  const validateForm = (event: React.SyntheticEvent) => {
    if (city == '' || region == '' || country == '') {
      alert("Can't find Location.");
      event.preventDefault();
    }
  };

  const resetForm = () => {
    setCity('');
    setRegion('');
    setCountry('');
    setLatitude(0);
    setLongitude(0);
    setLiked(true);
    onClose();
  };

  return (
    <Box>
      <Button onClick={onOpen} mt={6} mb={6}>
        Add Flight
      </Button>

      <Modal isOpen={isOpen} onClose={resetForm}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add previous flight</ModalHeader>
          <ModalCloseButton onClick={resetForm} />
          <form onSubmit={validateForm} action="/api/flights/new" method="post">
            <ModalBody>
              <Stack spacing={4}>
                <FormControl id="depCity">
                  <FormLabel>Departure City</FormLabel>
                  <Input
                    name="depCity"
                    type="text"
                    placeholder="e.g. Chicago"
                    variant="filled"
                    required
                  />
                </FormControl>

                <FormControl id="arrCity">
                  <FormLabel>Arrival City</FormLabel>
                  <Input
                    name="arrCity"
                    type="text"
                    placeholder="e.g. Austin"
                    variant="filled"
                    onBlur={(event) => checkCity(event.currentTarget)}
                    required
                  />
                </FormControl>

                <FormControl id="region">
                  <FormLabel>State / Region</FormLabel>
                  <Input
                    name="region"
                    type="text"
                    isReadOnly={true}
                    defaultValue={region}
                    variant="filled"
                    required
                  />
                </FormControl>

                <FormControl id="country">
                  <FormLabel>Country</FormLabel>
                  <Input
                    name="country"
                    type="text"
                    isReadOnly={true}
                    defaultValue={country}
                    variant="filled"
                    required
                  />
                </FormControl>

                <FormControl id="continent">
                  <FormLabel>Continent</FormLabel>
                  <Input
                    name="continent"
                    type="text"
                    isReadOnly={true}
                    defaultValue={continent}
                    variant="filled"
                    required
                  />
                </FormControl>

                <FormControl id="flightDate">
                  <FormLabel>Flight Date</FormLabel>
                  <Input name="flightDate" type="date" variant="filled" max={today} required />
                </FormControl>

                <FormControl id="enjoyedFlight">
                  <Center>
                    <Input
                      name="enjoyedFlight"
                      type="bool"
                      defaultValue={true.toString()}
                      value={enjoyedFlight.toString()}
                      hidden
                    />

                    <Checkbox defaultChecked onChange={(e) => setLiked(e.target.checked)}>
                      Did you enjoy this trip?
                    </Checkbox>
                  </Center>
                </FormControl>

                <Input
                  name="latitude"
                  type="number"
                  isReadOnly={true}
                  variant="filled"
                  value={latitude}
                  required
                  hidden
                />

                <Input
                  name="longitude"
                  type="number"
                  isReadOnly={true}
                  variant="filled"
                  value={longitude}
                  required
                  hidden
                />
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button type="submit" colorScheme="blue" mr={3}>
                Add
              </Button>
              <Button onClick={resetForm}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FlightHistory;
