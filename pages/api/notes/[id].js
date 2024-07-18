import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('notes-app');

  const { id } = req.query;

  switch (req.method) {
    case 'PUT':
      try {
        const { title, content } = req.body;
        const result = await db.collection('notes').updateOne(
          { _id: new ObjectId(id) },
          { $set: { title, content } }
        );
        if (result.modifiedCount === 1) {
          res.status(200).end();
        } else {
          res.status(404).end(`Note with id ${id} not found`);
        }
      } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).end('Error updating note');
      }
      break;
    case 'DELETE':
      try {
        const result = await db.collection('notes').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 1) {
          res.status(200).end();
        } else {
          res.status(404).end(`Note with id ${id} not found`);
        }
      } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).end('Error deleting note');
      }
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
