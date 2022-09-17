import StaticGameItemCollection from './StaticGameItemCollection';

export default interface StaticGameItemLocator {
  getStaticGameItemCollection: () => StaticGameItemCollection,
}
