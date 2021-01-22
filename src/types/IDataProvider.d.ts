interface IDataProvider {
  getData: () => Promise<TData>;
}
