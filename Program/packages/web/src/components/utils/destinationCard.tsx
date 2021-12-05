import { Box, Badge, Button, Link, Text } from '@chakra-ui/react';
import { ContinentBadgeColorMap } from './flightCard';

export interface Destination {
  destinationCity: string;
  destinationCountry: string;
  destinationContinent: string;
  destinationRegion: string;
  destinationLatitude: number;
  destinationLongitude: number;
  rating: number;
}

function normalize(city: string) {
  let ans = city.toLowerCase();

  if (city == 'Washington, D.C.') {
    return 'washington';
  } else if (city == 'New York City') {
    return 'new-york';
  }

  ans = ans.split('.').join('');
  ans = ans.split('-').join('');
  ans = ans.split(',').join('');
  ans = ans.split(' ').join('-');
  return ans;
}

const recommendationRankBadge = new Map();
recommendationRankBadge.set('Highly Recommended', 'pink');
recommendationRankBadge.set('Recommended', 'yellow');

function BadgeRating(rating: number) {
  if (rating < 5) {
    return 'Highly Recommended';
  } else {
    return 'Recommended';
  }
}

export const DestinationCard = ({
  destinationCity,
  destinationCountry,
  destinationContinent,
  destinationRegion,
  destinationLatitude,
  destinationLongitude,
  rating,
}: Destination) => {
  return (
    <Box background="white" maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Box p={4}>
        <Box display="flex" alignItems="baseline">
          <Badge
            borderRadius="full"
            px="2"
            colorScheme={recommendationRankBadge.get(BadgeRating(rating))}
          >
            {BadgeRating(rating)}
          </Badge>
        </Box>

        <Box mt="1" fontWeight="bold" fontSize="2xl" as="h4" lineHeight="tight" isTruncated>
          {destinationCity}
        </Box>

        <Box as="i">
          <Text>{destinationRegion},</Text>
          <Text>{destinationCountry}</Text>
        </Box>
        <Badge
          borderRadius="full"
          px="2"
          colorScheme={ContinentBadgeColorMap.get(destinationContinent)}
        >
          {destinationContinent}
        </Badge>

        <Box pt={2} align="center">
          <Button p={-1}>
            <Link
              href={'https://www.aa.com/en-us/flights-to-' + normalize(destinationCity)}
              target="_blank"
              style={{ textDecoration: 'none' }}
            >
              <Button>Book Flight</Button>
            </Link>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
