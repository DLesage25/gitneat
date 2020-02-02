describe('Files.js', () => {
    let myFunctions = require('../lib/files');

    describe('getCurrentDirectoryBase', () => {
        it('should return the current working directory', () => {
            return expect(myFunctions.getCurrentDirectoryBase()).toEqual(
                'gitneat'
            );
        });
    });

    describe('directoryExists', () => {
        it('should return truthy for an existent directory', () => {
            return expect(myFunctions.directoryExists('lib')).toBeTruthy();
        });
        it('should return falsy for a non-existent directory', () => {
            return expect(myFunctions.directoryExists('random')).toBeFalsy();
        });
    });
});
