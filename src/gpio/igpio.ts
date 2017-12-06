export default interface IGpio {
    readSync: () => boolean;
    writeSync: (value: boolean) => void;
    unexport: () => void;
    switch: (value: boolean) => void;
}
