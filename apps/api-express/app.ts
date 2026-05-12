import express from 'express';
import cors from 'cors';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Routes (on les ajoutera après)

export default app;