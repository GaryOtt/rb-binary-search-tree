An implementation of a Red/Black Binary Search Tree.

Originally created in 2014, this library has been thouroughly tested and battle hardened.

Binary search trees exhibit the following characteristics:
	Insertion:  O(log n)
	Removal:    O(log n)
	Search:     O(log n)

Thanks go to those responsible for this lecture which was supremely helpful: https://youtu.be/hm2GHwyKF1o?si=-WemyU80lZiaae_4


Example Usage:

```
const BinarySearchTree = require("rb-binary-search-tree");

const bst = new new BinarySearchTree();

bst.insert(1, "Apple");
bst.insert(2, "Pear");
bst.insert(3, "Orange");

console.log(bst.find(1));   //Apple
console.log(bst.find(2));   //Pear
console.log(bst.find(3));   //Orange

console.log(bst.length());  //3
console.log(bst.min());     //1
console.log(bst.max());     //3

bst.remove(2);
console.log(bst.find(2)); //null


//To iterate over all entries use either inOrderTraverse() or reverseOrderTraverse()
//To iterate over a subset, use rangeTraverse()
bst.inOrderTraverse(console.log);   //Output:
                                    //1   Apple
                                    //3   Orange

bst.empty();



```


This library contains a class with the following methods:


**instance.insert(key, data)**
Adds an entry to the BST.

**instance.remove(key)**
Removes an entry from the BST.

**instance.find(key)**
Returns an entry from the BST.

**instance.length()**
Returns the number of entries in the BST.

**instance.min()**
Returns the lowest key value.

**instance.max()**
Returns the highest key value.


**instance.inOrderTraverse(callBack)**
Calls callback for every entry in the BST starting from the lowest key value up to the highest.

The arguments key and data shall be passed to the call back function.


**instance.reverseOrderTraverse(callBack)**
Calls callback for every entry in the BST starting from the highest key value down to the lowest.

The arguments key and data shall be passed to the call back function.

**instance.rangeTraverse(from, to, callBack)**
Calls callback for every entry in the BST starting from the highest key value down to the lowest.

The arguments key and data shall be passed to the call back function.


**empty()**
Removes all entries from the BST.