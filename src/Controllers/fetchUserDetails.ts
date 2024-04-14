import { Response } from 'express';
import { UserData } from '../types';
import https from 'https';

// Define an interface for the structure of the result
interface GraphQLResult {
  errors?: any[]; // You might need to specify a more specific type for errors
  data?: UserData; // Assuming UserData is the expected type of the data
}

const fetchUserDetails = async (
  options: { username: string; limit: number },
  res: Response,
  formatData: (data: UserData) => void,
  query: string
): Promise<void> => {
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: query,
        variables: {
          username: options.username,
          limit: options.limit,
        },
      }),
      agent: agent,
    } as RequestInit); // Cast the options object to RequestInit

    // Explicitly assert the type of result
    const result = (await response.json()) as GraphQLResult;

    if (result.errors) {
      res.send(result);
      return; // Ensure to return here
    }

    if (result.data !== undefined) {
      res.json(formatData(result.data));
    } else {
      // Handle the case where result.data is undefined
      res.send('Data not found');
    }
  } catch (err) {
    console.error('Error: ', err);
    res.send(err);
  }
};

export default fetchUserDetails;
