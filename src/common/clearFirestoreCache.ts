const clearFirestoreCache = () => {
  try {
    // @ts-ignore
    const map = globalThis["_reactFirePreloadedObservables"];
    Array.from(map.keys()).forEach(
      (key) => (key as any).includes("firestore") && map.delete(key)
    );
  } catch (e) {
    console.log(e);
  }
};
export default clearFirestoreCache;
