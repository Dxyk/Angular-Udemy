import { ReversePipe } from './reverse.pipe';

describe('ReversePipe', () => {
  it('create an instance', () => {
    const pipe = new ReversePipe();
    expect(pipe).toBeTruthy();
  });

  it('create reverse a string correctly', () => {
    const pipe = new ReversePipe();
    expect(pipe.transform('hello')).toEqual('olleh');
  });
});
