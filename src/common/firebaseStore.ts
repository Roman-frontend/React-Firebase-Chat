import { getFirestore } from 'firebase/firestore';
import firebaseApp from './firebaseApp';

const firebaseStore = getFirestore(firebaseApp);

export default firebaseStore;
