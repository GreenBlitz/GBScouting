

class UndoButton<T>{
    
    private undoStack: T[] = [];

    private currentValue: T;

    constructor(initialValue: T) {
        this.currentValue = initialValue;
    }

    public undo(handleundo: (value: T) => void) {
        if (this.undoStack.length === 0) {
            return;
        }
       
        this.currentValue = this.undoStack.pop()!;
        handleundo(this.currentValue);
    }


    public setValue(value: T) {
        this.undoStack.push(this.currentValue);
        this.currentValue = value;
    }

    public getValue() {
        return this.currentValue;
    }
    
}