import express, { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import cors from 'cors';

const app = express();

// Middleware to handle cross-origin issues
app.use(cors());
app.use(express.json());
let passportToken: string;
let audienceToken: string;

// Middleware to log incoming requests
const requestLogger = (req: Request, res: Response, next: () => void) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
};

app.use(requestLogger);

const setPassportToken = (token: string): void => {
  passportToken = token;
};

const setAudienceToken = (audience_token: string): void => {
  audienceToken = audience_token;
};

const setHeader = async (): Promise<Record<string, any>> => {
  const grantFlowResponse = await callGrantFlow();
  setPassportToken(grantFlowResponse.data.access_token);

  return {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + passportToken,
  }
};

const callGrantFlow = async (): Promise<AxiosResponse> => {
  try {
    const response = await axios.post(
      'https://golden-image.member-passport-b-ts-stable-300-g001.primo-dev.com/grant-flow',
      {
        username: 'debenture',
        password: 'P@ssw0rd',
        device_id: 'xxx-xxx',
        device_name: 'oPone Xs mini',
      },
    );
    
    return response.data;
  } catch (error: any) {
    throw new Error('Error fetching external data: ' + error.message);
  }
};

app.get('/api/graphql', async (req: Request, res: Response) => {
  try {
    const query = `
      query AvailablePassportAudiences {
        availablePassportAudiences {
          token
        }
      }
    `;
    const variables = {}; // You can define variables as needed

    const response: AxiosResponse = await getData(query, variables);
    setAudienceToken(response.data.availablePassportAudiences.token);
    res.json(response);
  } catch (error: any) {
    console.error('Error fetching data from GraphQL:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const getData = async (query: string, variables: Record<string, any>): Promise<AxiosResponse> => {
  try {
    let headers = await setHeader();

    const response: AxiosResponse = await axios.post(
      'https://golden-image.campaign-b-ts-stable-300-g001.primo-dev.com/graphql/private',
      {
        query,
        variables,
      },
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error('Error fetching data from GraphQL: ' + error.message);
  }
};

// interface GrantFlowResponse {
//   data: GrantFlowData;
// }

// interface GrantFlowData {
//   user_id: string;
//   access_token: string;
//   refresh_token: string;
// }

// interface DataAvailablePassportAudiences {
//   data: AvailablePassportAudiences;
// }

// interface AvailablePassportAudiences {
//   token: string
// }

app.get('/api/graphql2', async (req: Request, res: Response) => {
  try {
    const query = `
    query PassportListAvailableCampaign($filter: AvailableCampaignListFilter, $option: ListCampaignAvailableOptions) {
      passportListAvailableCampaigns(
        filter: $filter
        option: $option
    ) {
        totalItems
        items {
          id
          createdAt
          updatedAt
          createdBy
          updatedBy
          status {
            id
            name
          }
          inUsed
          imageTh
          imageEn
          periods {
            id
            startDate
            endDate
            isEndLess
          }
          campaignTargetGroupType {
            id
            name
          }
          campaignOutcome {
            id
            outcomeType {
              id
              nameTh
              nameEn
            }
            outcomeValue
            outcomeTargetId
            couponTypeId
            expirationType {
              id
              nameTh
              nameEn
              valueTemplate
            }
            expirationValue {
                ...baseExpirationTypePeriodValue
                ...baseExpirationTypeDefaultValue
                ...baseExpirationTypePeriodWithinValue
                ...baseExpirationTypeRoundPeriodValue
            }
            campaignOutcomeLimit {
              id
              limitType {
                id
                nameTh
                nameEn
              }
              limitValue
              unitType {
                id
                nameTh
                nameEn
              }
            }
            campaignOutcomeGroupId
            name
            nameEn
            imageEn
            imageTh
            descriptionEn
            descriptionTh
            conditionTh
            conditionEn
            inUsed
          }
          program {
            id
            status
            periods {
              id
              startDate
              endDate
              startWithCampaign
              endWithCampaign
            }
            isLimit
            limitValue
            outcomeLimitValue
            inUsed
            imageTh
            imageEn
            programType {
              id
              nameEn
              nameTh
            }
            operationType
            programOutcomeCondition {
              id
              outcomeValue
              programOutcomeLimit {
                id
                limitValue
                unitType {
                  id
                  nameTh
                  nameEn
                }
                countStartDateTime
                countEndDateTime
                latestTotalCount
                totalCountLastDayUpdatedAt
              }
              programOutcomeAcceptance {
                id
                acceptanceType {
                  id
                  nameTh
                  nameEn
                }
                programOutcomeAcceptanceCondition {
                  id
                  conditionTargetId
                  conditionValue
                }
              }
              programOutcomeMarkUse {
                id
                markUseType {
                  id
                  nameTh
                  nameEn
                }
                validWithinValue
                unitType {
                  id
                  nameTh
                  nameEn
                }
                isOwnerOnly
              }
              programOutcomeCouponDisplayTypes {
                  id
                  nameTh
                  nameEn
              }
              displayData {
                available
                displayCode
                message
              }
            }
            periodLimitValue
            periodLimitUnitType {
              id
              nameTh
              nameEn
            }
            name
            nameEn
          }
          code
          nameEn
          nameTh
          descriptionEn
          descriptionTh
          conditionTh
          conditionEn
        }
      }
    }
    
    fragment  baseExpirationTypePeriodValue on  BaseExpirationTypePeriodValue {
          expirationTypeId
          value {
            period {
              startDate
              endDate
            }
          }
    }
        
    fragment  baseExpirationTypeDefaultValue on  BaseExpirationTypeDefaultValue {
        expirationTypeId
    }
    
    fragment baseExpirationTypePeriodWithinValue on   BaseExpirationTypePeriodWithinValue {
          expirationTypeId
          value {
            period {
              startDate
              within
            }
          }
       }
      
      fragment baseExpirationTypeRoundPeriodValue on  BaseExpirationTypeRoundPeriodValue {
          expirationTypeId
          value {
            period {
              startDate
              roundValue
              timeUnit
              endTimeUnit
            }
          }
      }    
    `;
    const variables = {
      "filter": {
          "memberNo": "M0000000011",
          "programType": "PRIVILEGE"
      },
      "option": {
          "skip": 0,
          "take": 10
      }
  };

    const response: AxiosResponse = await getListAvailableCampaigns(query, variables);
    res.json(response);
  } catch (error: any) {
    console.error('Error fetching data from GraphQL:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const getListAvailableCampaigns = async (query: string, variables: Record<string, any>): Promise<AxiosResponse> => {
  try {
    let headers = await setHeader();
    headers = { ...headers, 
    'Authorization-type': 'passportMember',
  'Audience-token': audienceToken}

    const response: AxiosResponse = await axios.post(
      'https://golden-image.campaign-b-ts-stable-300-g001.primo-dev.com/graphql/private',
      {
        query,
        variables,
      },
      {
        headers,
      }
    );
    console.log(response.data)
    return response.data;
  } catch (error: any) {
    throw new Error('Error fetching data from GraphQL: ' + error.message);
  }
};

const port = 5001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});