import { getStorage } from 'firebase/storage';
import firebaseApp from './firebaseApp';

const firebaseStorage = getStorage(firebaseApp);

export default firebaseStorage;
