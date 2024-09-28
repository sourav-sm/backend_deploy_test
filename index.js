


// // Instantiate a BigQuery client using credentials
// const bigquery = new BigQuery({ credentials, projectId: credentials.project_id });

// // Define a route to fetch data from BigQuery
// // app.get('/data', async (req, res) => {
// //   try {
// //     //const query = `SELECT name, age FROM \`your-project-id.your-dataset.your-table\` LIMIT 10`;
// //     const query = `SELECT * FROM \`prodloop.Insights_DS.Insights_call_request_with_partner\` LIMIT 1000;`;

// //     // Run the query
// //     const [rows] = await bigquery.query(query);

// //     // Send the data as JSON
// //     res.json(rows);
// //   } catch (error) {
// //     console.error('Error querying BigQuery:', error);
// //     res.status(500).send('Error querying BigQuery');
// //   }
// // });

// app.post('/feedbacks',async(req,res)=>{
//     try{
//         const { start_date, end_date, partner_type, sentiment, has_waypoints, limit, offset } = req.body;
//         let query = `
//       SELECT *
//       FROM \`prodloop.Insights_DS.Insights_call_request_with_partner\`
//       WHERE CALL_DATE BETWEEN @start_date AND @end_date
//     `;
//     // Add dynamic filters
//     if (partner_type && partner_type.length) {
//         query += ` AND partner_type IN UNNEST(@partner_type)`;
//       }
//       if (sentiment && sentiment.length) {
//         query += ` AND Sentiment IN UNNEST(@sentiment)`;
//       }
//       if (has_waypoints !== undefined) {
//         query += ` AND has_waypoints = @has_waypoints`;
//       }
  
//       query += `
//         ORDER BY CALL_DATE DESC
//         LIMIT @limit
//         OFFSET @offset
//       `;

//     // Run the query
//     const [rows] = await bigquery.query(options);

//     // Return paginated results
//     const totalQuery = `
//       SELECT COUNT(*) as total_count
//       FROM \`prodloop.Insights_DS.Insights_call_request_with_partner\`
//       WHERE CALL_DATE BETWEEN @start_date AND @end_date
//     `;
//     const [totalResult] = await bigquery.query({
//       query: totalQuery,
//       params: {
//         start_date,
//         end_date,
//       },
//     });
//     const totalCount = totalResult[0].total_count;

//     res.json({ feedbacks: rows, total_count: totalCount });
//   } catch (error) {
//     console.error('Error querying BigQuery:', error);
//     res.status(500).send('Error querying BigQuery');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// const express = require('express');
// const { BigQuery } = require('@google-cloud/bigquery');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const dotenv=require('dotenv');

// dotenv.config();

// const app = express();
// const port = 3000;

// // Enable CORS and use body-parser to handle JSON requests
// app.use(cors());
// app.use(bodyParser.json());



// // Instantiate a BigQuery client using credentials
// const bigquery = new BigQuery({ credentials, projectId: credentials.project_id });

// // Define a route to fetch data from BigQuery
// app.post('/feedbacks', async (req, res) => {
//   try {
//     const { start_date, end_date, partner_type, sentiment, has_waypoints, limit, offset } = req.body;

//     // SQL query to fetch data from BigQuery with the filters from the request
//     // const query = `
//     //   SELECT * 
//     //   FROM \`prodloop.Insights_DS.Insights_call_request_with_partner\`
//     //   WHERE 
//     //     CALL_DATE BETWEEN @start_date AND @end_date
//     //     AND partner_type IN UNNEST(@partner_type)
//     //     AND Sentiment IN UNNEST(@sentiment)
//     //     AND (@has_waypoints IS NULL OR has_waypoints = @has_waypoints)
//     //   LIMIT @limit
//     //   OFFSET @offset;
//     // `;
//     const query = `
//        SELECT * 
//        FROM \`prodloop.Insights_DS.Insights_call_request_with_partner\`
//        WHERE 
//          CALL_DATE BETWEEN @start_date AND @end_date
//          AND partner_type IN UNNEST(@partner_type)
//          AND Sentiment IN UNNEST(@sentiment)
//          AND (@has_waypoints IS NULL OR HAS_WAYPOINTS = @has_waypoints)
//        ORDER BY CALL_DATE DESC
//        LIMIT @limit
//        OFFSET @offset;
//      `;

    

//     const options = {
//       query,
//       params: {
//         start_date: start_date,
//         end_date: end_date,
//         partner_type: partner_type || ["Partner", "Customer"],
//         sentiment: sentiment || ["positive", "negative", "neutral"],
//         has_waypoints: has_waypoints === undefined ? null : has_waypoints,
//         limit: limit || 25,
//         offset: offset || 0
//       },
//     };

//     // Run the query
//     const [rows] = await bigquery.query(options);

//     res.json({
//       feedbacks: rows,
//       total_count: rows.length // Optionally adjust this if you have the total count in the query
//     });
// //   } catch (error) {
// //     console.error('Error querying BigQuery:', error);
// //     res.status(500).send('Error querying BigQuery');
// //   }
// }catch (error) {
//     console.error('Error querying BigQuery:', error);
//     res.status(500).json({
//       error: 'Error querying BigQuery',
//       details: error.message,
//       stack: error.stack
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });



const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Add Swagger dependencies
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config();

const app = express();
const port = 3000;

// Enable CORS and use body-parser to handle JSON requests
app.use(cors());
app.use(bodyParser.json());

const credentials = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL
};

// Instantiate a BigQuery client using credentials
const bigquery = new BigQuery({ credentials, projectId: credentials.project_id });

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'A sample API for learning Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./index.js'], // Path to the API docs (you can include other route files here)
};


const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Use swagger-ui-express for your app documentation endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /feedbacks:
 *   post:
 *     summary: Fetch feedbacks from BigQuery
 *     description: Returns a list of feedbacks based on the provided filters.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_date:
 *                 type: string
 *                 example: '2023-01-01'
 *               end_date:
 *                 type: string
 *                 example: '2023-12-31'
 *               partner_type:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Partner", "Customer"]
 *               sentiment:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["positive", "negative", "neutral"]
 *               has_waypoints:
 *                 type: boolean
 *               limit:
 *                 type: integer
 *                 example: 25
 *               offset:
 *                 type: integer
 *                 example: 0
 *     responses:
 *       200:
 *         description: A list of feedbacks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 feedbacks:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total_count:
 *                   type: integer
 *       500:
 *         description: Error querying BigQuery
 */

// Define a route to fetch data from BigQuery
app.post('/feedbacks', async (req, res) => {
  try {
    const { start_date, end_date, partner_type, sentiment, has_waypoints, limit, offset } = req.body;

    // const query = `
    //    SELECT * 
    //    FROM \`prodloop.Insights_DS.Insights_call_request_with_partner\`
    //    WHERE 
    //      CALL_DATE BETWEEN @start_date AND @end_date
    //      AND partner_type IN UNNEST(@partner_type)
    //      AND Sentiment IN UNNEST(@sentiment)
    //      AND (@has_waypoints IS NULL OR HAS_WAYPOINTS = @has_waypoints)
    //    ORDER BY CALL_DATE DESC
    //    LIMIT @limit
    //    OFFSET @offset;
    //  `;
    const query=`
     SELECT * 
     FROM \`prodloop.Insights_DS.Insights_call_request_with_partner_aggregated\`
     WHERE
       PARSE_DATE('%m/%d/%Y',CALL_DATE) BETWEEN @start_date AND @end_date
       AND partner_type IN UNNEST(@partner_type)
       AND Sentiment IN UNNEST(@sentiment)
       AND (@has_waypoints IS NULL OR LOWER(HAS_WAYPOINTS) = LOWER(@has_waypoints))
     ORDER BY PARSE_DATE('%m/%d/%Y',CALL_DATE) DESC
    LIMIT @limit
    OFFSET @offset;
    `;

    const options = {
      query,
      params: {
        start_date: start_date,
        end_date: end_date,
        partner_type: partner_type || ["Partner", "Customer"],
        sentiment: sentiment || ["positive", "negative", "neutral"],
        //has_waypoints: has_waypoints === undefined ? null : has_waypoints,
        has_waypoints: has_waypoints === undefined ? null : has_waypoints ? "true" : "false",
        limit: limit || 25,
        offset: offset || 0
      },
    };

    // Run the query
    const [rows] = await bigquery.query(options);

    res.json({
      feedbacks: rows,
      total_count: rows.length // Optionally adjust this if you have the total count in the query
    });
  } catch (error) {
    console.error('Error querying BigQuery:', error);
    res.status(500).json({
      error: 'Error querying BigQuery',
      details: error.message,
      stack: error.stack
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});

