import express from 'express';
import cors from 'cors';
import GroupRoutes from './routes/GroupRoutes';
import MeetingsRoutes from './routes/MeetingsRoutes';
import UsersRoutes from './routes/UsersRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/groups', GroupRoutes);
app.use('/meetings', MeetingsRoutes);
app.use('/users', UsersRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});