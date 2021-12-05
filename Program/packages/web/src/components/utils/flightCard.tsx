import { Box, Badge, Text } from '@chakra-ui/react';

export interface Flight {
  flightDate: string;
  departureCity: string;
  destinationCity: string;
  destinationRegion: string;
  destinationCountry: string;
  destinationContinent: string;
  destinationLatitude: number;
  destinationLongitude: number;
}

export const ContinentBadgeColorMap = new Map();

ContinentBadgeColorMap.set('Africa', 'orange');
ContinentBadgeColorMap.set('Antartica', 'blackAlpha');
ContinentBadgeColorMap.set('Asia', 'gray');
ContinentBadgeColorMap.set('Oceania', 'green');
ContinentBadgeColorMap.set('Europe', 'purple');
ContinentBadgeColorMap.set('North America', 'red');
ContinentBadgeColorMap.set('South America', 'twitter');

export const FlightCard = ({
  flightDate,
  departureCity,
  destinationCity,
  destinationRegion,
  destinationCountry,
  destinationContinent,
  destinationLatitude,
  destinationLongitude,
}: Flight) => {
  return (
    <Box p="3" background="white" maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Box p="1">
        <Box display="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme="teal">
            Visited
          </Badge>
          <Box
            color="gray"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            {flightDate}
          </Box>
        </Box>

        <Box mt="1" fontWeight="bold" fontSize="2xl" as="h4" lineHeight="tight" isTruncated>
          {destinationCity}
        </Box>

        <Box as="i">
          <Text>{destinationRegion},</Text>
          <Text>{destinationCountry}</Text>
        </Box>

        <Box fontSize="xs" display="flex" mt="1" alignItems="center">
          From:
          {
            <Box as="span" ml="2" fontSize=" xs">
              {departureCity}
            </Box>
          }
        </Box>
      </Box>
      <Badge
        borderRadius="full"
        px="2"
        colorScheme={ContinentBadgeColorMap.get(destinationContinent)}
      >
        {destinationContinent}
      </Badge>
    </Box>
  );
};
