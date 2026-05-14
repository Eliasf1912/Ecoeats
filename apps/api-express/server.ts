import app from './app';
import 'dotenv/config';

const PORT = process.env.PORT_EXPRESS || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});