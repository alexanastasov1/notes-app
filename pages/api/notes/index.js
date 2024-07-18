import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('notes-app');

  switch (req.method) {
    case 'GET':
      const { userId } = req.query;
      try {
        const notes = await db.collection('notes').find({ userId }).sort({ createdAt: -1 }).toArray();
        res.json(notes);
      } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).end('Error fetching notes');
      }
      break;
    case 'POST':
      try {
        const { title, content } = req.body;
        const userId = req.query.userId;
        const newNote = { title, content, userId, createdAt: new Date() };
        await db.collection('notes').insertOne(newNote);
        res.json(newNote);
      } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).end('Error creating note');
      }
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
