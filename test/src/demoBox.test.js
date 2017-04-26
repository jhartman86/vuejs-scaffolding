import { makeInstance } from '@/lib/bootstrap';

describe('first test', () => {

  it('should run', done => {
    console.log('test ran! again', makeInstance);
    done();
  });

});