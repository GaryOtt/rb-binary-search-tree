module.exports = function() {
	"use strict";
	///Implementation of a Red-Black Binary Search Tree.
	//By Gary Ott,

	//Created 7th February 2014.
	//Modified for use with Browserify, 6th May 2016
	//Added length property, 21st June 2016
	
	//(ɔ) Copyleft. All wrongs reserved.
	
	//Uses
	//----
	//For situations where any entry in a whole set may need to be sought quickly.

	//Characteristics
	//---------------
	//Insertion:	O(log n)
	//Removal:		O(log n)
	//Search:		O(log n)

	//Limitations
	//-----------
	//Tree maybe imbalanced by ratio up to 2:1


	//Search for 'DEBUG' for commented out debugging code.


	//PRIVATE VARIABLES:
	var that = this,
		startNode = null,
		count = 0,

		//logEverything = false,

	/*	countRemoveType = {
			oneone: 0,
			onetwo: 0,
			
			twooneone: 0,
			twoonetwo: 0,
			
			twotwoone: 0,
			twotwotwo: 0
		},
*/

	//PRIVATE FUNCTIONS:
		leftRightDecendant = function(n) {
			//	This function combined with getUncle, getSibling and rotate are used to
			//	abstract problem such that their solution can work in either left handed
			//	or right handed cases.

			//	Of the 4 possible cases, 1 and 3 return true:
			//      1:   O    2:    O   3:  O    4:  O
			//          /          /         \        \
			//         O          O           O        O
			//          \        /           /          \
			//           O      O           O            O

			//	The passed in node is the grandchild.

			if (n === n.parent.left) {
				return (n.parent === n.parent.parent.right);
			}
			return (n.parent === n.parent.parent.left);
		},

		checkColour = function(n) {
			var u = null,
				g = null;

			//console.assert(n.red);

			if (!n.parent) {
				//n is root. Set to black and be done.
				n.red = false;
				return;
			}

			if (!n.parent.red) {
				//n has a black parent. Tree valid.
				return;
			}

			//n has a red parent.
			u = getUncle(n);
			g = getGrandparent(n);

			if (u && (u.red)) {
				//There is a red uncle
				n.parent.red = false;
				u.red = false;
				g.red = true;	//MUST have a grandparent or we couldn't have had an uncle.

				checkColour(g);		//Recursive. checkColour expects the
			}
			else if (g) {
				//There is a black uncle (might be a nil).
				//if (((n === n.parent.right) && (n.parent === g.left)) || ((n === n.parent.left) && (n.parent === g.right))) {
				if (leftRightDecendant(n)) {
					//UNparallel joins requiring preliminary left rotate followed by right rotate.
					rotate(n);
					n.red = false;
					n.parent.red = true;
					rotate(n);
				}
				else {
					//Grandparent~parent and parent~node joins are both left or both right.
					n.parent.red = false;
					g.red = true;
					rotate(n.parent);
				}
			}
		},

		rotate = function(n) {
			//	This function combined with getUncle, getSibling and rotate are used to
			//	abstract problem such that their solution can work in either left handed
			//	or right handed cases.

			if (n.parent.left === n) {
				rotateRight(n);
			}
			else
				{
				rotateLeft(n);
			}
		},

		rotateLeft = function(n) {
			var p = n.parent,		//Must exist.
				g = p.parent;		//Could be null.

			if (!p) {
				throw new Error("rotateLeft: Input node has no parent.");
			}

			if (g) {
				if (g.right === p) {
					g.right = n;
				}
				else
					{
					g.left = n;
				}
			}
			else
				{
				startNode = n;	//We're about to rotate n into the top spot.
			}

			n.parent = g;
			p.parent = n;
			if (n.left) {
				n.left.parent = p;
			}

			p.right = n.left;
			n.left = p;
		},

		rotateRight = function(n) {
			var p = n.parent,		//Must exist.
				g = p.parent;		//Could be null.


			if (!p) {
				throw new Error("rotateRight: Input node has no parent.");
			}

			if (g) {
				if (g.right === p) {
					g.right = n;
				}
				else
					{
					g.left = n;
				}
			}
			else
				{
				startNode = n;	//We're about to rotate n into the top spot.
			}

			n.parent = g;
			p.parent = n;
			if (n.right) {
				n.right.parent = p;
			}

			p.left = n.right;
			n.right = p;
		},

		getGrandparent = function(n) {
			return ((n && n.parent) ? n.parent.parent : null);		//Could include n.parent.parent in condition but it would have to be evaluated twice.
		},

		getSibling = function(n) {
			//	This function combined with getUncle, getSibling and rotate are used to
			//	abstract problem such that their solution can work in either left handed
			//	or right handed cases.

			if (n.parent) {
				if (n === n.parent.left) {
					return n.parent.right;
				}
				return n.parent.left;
			}
			return null;
		},

		getUncle = function(n) {
			//	This function combined with getUncle, getSibling and rotate are used to
			//	abstract problem such that their solution can work in either left handed
			//	or right handed cases.

			var g = getGrandparent(n);

			if (!g) {
				return null; // No grandparent means no uncle
			}

			return ((n.parent === g.left) ? g.right : g.left);
		},

		seekNode = function(node, key) {
			if (!node) {
				return null;
			}

			if (node.key === key) {
				return node;
			}

			if (key > node.key) {
				return seekNode(node.right, key);
			}

			if (key < node.key) {
				return seekNode(node.left, key);
			}
		},

		traverse = function(node, callBack) {
			if (!node) { return; }

			traverse(node.left, callBack);
			if (callBack(node.key, node.data) !== true) {		//Cease traversal if callBack returns true.
				traverse(node.right, callBack);
			}
		},

		traverseReverse = function(node, callBack) {
			if (!node) { return; }
			traverseReverse(node.right, callBack);
			if (callBack(node.key, node.data) !== true) {
				traverseReverse(node.left, callBack);
			}
		},

		nodeIsBlack = function(n) {
			if (!n) {
				return true;
			}
			return !n.red;
		}; /*,

		//	DEBUG
		dumpTree = function(node, heading) {

			var doDump = function(node, level, left) {
					if (node) {
						level = level || "";

						console.log(level + node.key + "   " + (node.red ? "RED" : "BLACK") + "    " + (left ? "(left)" : "(right)"));
						doDump(node.left, level + "  ", true);
						doDump(node.right, level + "  ", false);
					}
				};

			console.log("\n\n" + heading);
			doDump(node);
		},

		verifyTree = function() {
			try {
				//Condition 1:
				//		Nodes are either black or red.
				//		Impossible to be otherwise in this implementation.

				//Condition 2:
				//		Root node is always black.
				console.assert(startNode.red === false);

				//Condition 3:
				//		All leaves are black.
				//		Impossible to be otherwise in this implementation (leaves are null).

				//Condition 4:
				//		Every red node has two children and both are black.
				var verify_property_4 = function (n) {
						if (!nodeIsBlack(n)) {
							console.assert(nodeIsBlack(n.left));
							console.assert(nodeIsBlack(n.right));
							console.assert(nodeIsBlack(n.parent));
						}
						
						if (!n) {
							return;
						}

						verify_property_4(n.left);
						verify_property_4(n.right);
					};

				verify_property_4(startNode);

				//Condition 5:
				//		All paths from any given node to its leaf nodes contain the same number of black nodes.
				//
				var compareNodeCount = function(n) {

					var leftCount = 0,
						rightCount = 0;

					if (!n) {
						return 1;		//'Node' is null, is black.
					}

					leftCount = compareNodeCount(n.left);
					rightCount = compareNodeCount(n.right);
					//if (n !== startNode) {
						console.assert(leftCount === rightCount);
					//}

					return leftCount + (n.red ? 0 : 1);
				};

				compareNodeCount(startNode);

				//Condition 6 (mine):
				//		A nodes childs parent is the node.
				var checkParent = function(n) {
					if (n.left) {
						console.assert(n.left.parent === n);
						checkParent(n.left);
					}

					if (n.right) {
						console.assert(n.right.parent === n);
						checkParent(n.right);
					}
				};

				checkParent(startNode);
			}
			catch (e) {
				console.log("AT FAILURE:");
				console.log("-----------");
				dumpTree(startNode, "Point of failure");
				throw e;
			}
		};

		*/

	//PUBLIC FUNCTIONS:

	that.remove = function(key) {
		//console.log("\n\n\n==========================");
		//console.log("REMOVING " + key);
		//console.log("==========================");
		

		var n     = seekNode(startNode, key),
			child = null,

			resolveBlackCount = function(n, p, s, n_lt_p) {			//n_lt_p means node is less than parent (left of)

				//The node n is on a side of a tree that has lost a black node.
				//n maybe null if the deleted node had no children.
				//Therefore there should be a parent unless we have reached the top of the tree.
				//Once we reach the top of the tree, there can no longer be an imbalance. 

				var temp   = null,
					nephew = null,
					g1     = null,		//Grandchild 1
					g2     = null;		//Grandchild 2


				//if (logEverything) {
				//	console.log("START resolveBlackCount of :" + (n ? n.key : "(null)"));
				//	console.log("---------------------------------------");
				//}

				//The really, really easy case:
				if (n && n.red) {
					n.red = false;
					//if (logEverything) {
					//	dumpTree(startNode, "Easy case");
					//}
					return;
				}

				if (!p) {
					return;		//Stop recursing when there is no higher level to take it to.
				}


				if (s && p.red) {
					//Case 1.1 and Case 1.2
					g1 = null;
					if (s.left && s.left.red) {
						g1 = s.left;
					}
					else if (s.right && s.right.red) {
						g1 = s.right;
					}

					if (g1) {
						//Case 1.1
						//Parent of n is red and sibling of n has red children.

						if (leftRightDecendant(g1)) {
							//Do a preliminary rotation to straighten this mess out.
							rotate(g1);
							s = g1;
						}

						rotate(s);

						//Recolour
						p.parent.red = true;
						p.red = false;
						getSibling(p).red = false;

						//if (logEverything) {
						//	dumpTree(startNode, "case 1.1");
						//}
					}
					else {
						//Case 1.2
						//Parent of n is red and sibling of n has only black children.

						p.red = false;
						s.red = true;

						//if (logEverything) {
						//	dumpTree(startNode, "case 1.2");
						//}
					}
				}
				else {
					//Case 2.1.1, 2.1.2, 2.2.1 and 2.2.2
					if (s && s.red) {
						//Case 2.1.1 and case 2.1.2

						nephew = (n_lt_p ? s.left : s.right);
					
						if (!nephew) {
							//This never happens in unit testing.

							//This condition should never happen because it means the tree does not conform to the rules.
							throw new Error("Unhandled condition 1");
						}

						if (nephew && (nodeIsBlack(nephew.left) && nodeIsBlack(nephew.right))) {
							//Case 2.1.2
							//Sibling of n has only black grandchildren.

							s.red = false;
							(n_lt_p ? s.left : s.right).red = true;
							rotate(s);

							//if (logEverything) {
							//	dumpTree(startNode, "case 2.1.2");
							//}
						}
						else {
							//Case 2.1.1
							//Sibling of n has a red grandchild
				
							//Online documentation does not say the child of nephew that is a left-right decendant must be red. But it MUST!
							if ((nephew.left && !nephew.right) || (!nephew.left && nephew.right)) {
								//Handle condition not mentioned in documentation

								//console.log("Correction needed.");

								if (nephew.left && nephew.left.red && !leftRightDecendant(nephew.left)) {
									//console.log("Correction 1 applied.");
									temp = nephew.left;
									nephew.red = true;
									nephew.left.red = false;

									rotate(nephew.left);

									nephew = temp;

									//if (logEverything) {
									//	dumpTree(startNode, "Case 2.1.1 Pre-correction (A)");
									//}
								}
								else if (nephew.right && nephew.right.red && !leftRightDecendant(nephew.right)) {
									//console.log("Correction 2 applied");
									temp = nephew.right;
									nephew.red = true;
									nephew.right.red = false;

									rotate(nephew.right);

									nephew = temp;

									//if (logEverything) {
									//	dumpTree(startNode, "Case 2.1.1 Pre-correction (B)");
									//}
								}
							}

							//if (logEverything) {
							//	console.log("nephew is ", nephew.key);
							//}

							if (nephew.left && leftRightDecendant(nephew.left)) {

								//if (logEverything) {
								//	console.log("ON THE LEFT");
								//}

								if (nephew.left.red) {
									nephew.left.red = false;

									rotate(nephew);
									//if (logEverything) {
									//	dumpTree(startNode, "Case 2.1.1: Step L-A1");
									//}

									rotate(nephew);
									//if (logEverything) {
									//	dumpTree(startNode, "Case 2.1.1: Step L-A2");
									//}
								}
								else {
									temp = nephew.left;

									rotate(nephew);
									//if (logEverything) {
									//	dumpTree(startNode, "Case 2.1.1: Step L-B1");
									//}

									rotate(nephew);
									//if (logEverything) {
									//	dumpTree(startNode, "Case 2.1.1: Step L-B2");									
									//	console.log("Recursing...");
									//}

									resolveBlackCount(temp, temp.parent, getSibling(temp), (temp.parent.left === temp));
								}
							}
							else if (nephew.right && leftRightDecendant(nephew.right)) {

								//if (logEverything) {
								//	console.log("ON THE RIGHT");
								//}
								
								if (nephew.right.red) {
									nephew.right.red = false;

									rotate(nephew);
									//if (logEverything) {
									//	dumpTree(startNode, "Case 2.1.1: Step R-A1");
									//}

									rotate(nephew);
									//if (logEverything) {
									//	dumpTree(startNode, "Case 2.1.1: Step R-A2");
									//}
								}
								else {
									temp = nephew.right;

									rotate(nephew);
									//if (logEverything) {
									//	dumpTree(startNode, "Case 2.1.1: Step R-B1");
									//}

									rotate(nephew);
									//if (logEverything) {
									//	dumpTree(startNode, "Case 2.1.1: Step R-B2");
									//	console.log("Recursing...");
									//}

									resolveBlackCount(temp, temp.parent, getSibling(temp), (temp.parent.left === temp));
								}
							}

							//if (logEverything) {
							//	dumpTree(startNode, "case 2.1.1");
							//}
						}
					}
					else {

						//Case 2.2.1 and case 2.2.2

						if (s && s.left && s.left.red) {
							g1 = s.left;
						}
						else if (s && s.right && s.right.red) {
							g1 =  s.right;
						}

						if (g1) {
							//Case 2.2.1

							//console.log("case 2.2.1");
							
							//Sibling of n has a red child.
							if (!leftRightDecendant(g1)) {
								g2 = g1.parent;
								g1.red = false;
								g2.red = true;
								rotate(g1);
								g1 = g2;
							}
							rotate(g1);		//g1 moves 1 step up the tree...
							rotate(g1);		//and then up a 2nd step.
							g1.red = false;

							//if (logEverything) {
							//	dumpTree(startNode, "case 2.2.1");
							//}
						}
						else {
							//Case 2.2.2
							//Sibling of n does not have a red child.
							if (s) {
								s.red = true;
							}

							if (p.parent) {
								//console.log("recursing");
								resolveBlackCount(p, p.parent, getSibling(p), (p === p.parent.left));			//If we can't solve the problem at this level, move up a level.
							}


							//if (logEverything) {
							//	dumpTree(startNode, "case 2.2.2");
							//}
						}
					}
				}


				//console.log("END resolveBlackCount:" + n.key);
				//console.log("--------------------------");

				//verifyTree();  //DEBUG

				//dumpTree(startNode);
			};


		//if (key === "1/SRV/install/device/932") {
		//	logEverything = true;
		//}

		if (!n) {
			return;
		}

		count -= 1;

		//if (logEverything) {
		//	dumpTree(startNode, "INIT");
		//}

		//If n has two children, we cannot delete it without replacing it with another node that can take
		//its place.
		if (n.left && n.right) {

			//Find in order successor.
			child = n.right;
			while (child.left) {
				child = child.left;
			}

			//Move key and data from in-order successor into position of deleted node (less operations than
			//actually replacing the node and updating all links).
			n.key  = child.key;
			n.data = child.data;

			//Now it is the in-order-successor that must be deleted.
			n = child;

			//n is now garenteed to have less than two children.
		}

		//n is the node we want to delete

		//n has at most one child.
		child = (n.right || n.left);

		//Handle special case of n being root:
		if (!n.parent) {
			if (child) {
				startNode = child;
				startNode.parent = null;
			}
			else {
				startNode = null;
			}
			return;
		}


		//Now we can finally remove n from the tree knowing it is safe:
		if (n.parent.right === n) {
			n.parent.right = child;
			if (child) {
				child.parent = n.parent;
			}

			if (!n.red) {
				//Node deleted is black so black count is affected.
				resolveBlackCount(child, n.parent, n.parent.left, false);
			}
		}
		else {
			n.parent.left = child;
			if (child) {
				child.parent = n.parent;
			}

			if (!n.red) {
				resolveBlackCount(child, n.parent, n.parent.right, true);
			}
		}

		//Don't allow memory leaks!
		n.parent = undefined;
		n.left   = undefined;
		n.right  = undefined;

		startNode.red = false;

		//verifyTree();	//DEBUG
	};

	that.find = function(key) {
		var resultNode = seekNode(startNode, key);
		return (resultNode ? resultNode.data : null);
	};

	that.insert = function(key, data) {
		var n = seekNode(startNode, key),

			makeNode = function(key, data, parent) {
				return {
					parent: parent,
					key:    key,
					data:   data,
					red:    true,
					left:   null,
					right:  null
				};
			},

			insertNode = function(node, key, data) {

				if (!node) {
					startNode = makeNode(key, data, null);
					return startNode;
				}

				if (key < node.key) {
					if (!node.left) {
						node.left = makeNode(key, data, node);
						return node.left;
					}

					return insertNode(node.left, key, data);
				}

				if (!node.right) {
					node.right = makeNode(key, data, node);
					return node.right;
				}

				return insertNode(node.right, key, data);
			};

		if (n) {
			throw new Error("Non-unique key");
		}

		count += 1;

		checkColour(insertNode(startNode, key, data));

		startNode.red = false;

		//verifyTree();	//DEBUG
	};

	that.length = function() {
		return count;
	};

	that.max = function() {
		var node = startNode;
		while (node.right) {
			node = node.right;
		}

		return node.data;
	};

	that.min = function() {
		var node = startNode;
		while (node.left) {
			node = node.left;
		}

		return node.data;
	};

	that.inOrderTraverse = function(callBack) {
		if (!(callBack instanceof Function)) {
			throw new Error("BinarySearchTree.inOrderTraverse: callBack must be a function.");
		}
		
		traverse(startNode, callBack);
	};

	that.reverseOrderTraverse = function(callBack) {
		if (!(callBack instanceof Function)) {
			throw new Error("BinarySearchTree.reverseOrderTraverse: callBack must be a function.");
		}
		
		traverseReverse(startNode, callBack);
	};

	that.rangeTraverse = function(from, to, callBack) {
		var h_limitCallBack = function(key, data) {
				//'from' is less than 'to'
				if ((key >= from) && (key <= to)) { callBack(key, data); }
				return (key >= to);
			},

			h_limitCallBackRev = function(key, data) {
				//'from' is greater than 'to'
				if ((key >= to) && (key <= from)) { callBack(key, data); }
				return (key <= to);
			},

			findSubTree = function(node) {
				//'from' is less than 'to'.
				if (!node) { return null; }
				if (node.key > to) { return findSubTree(node.left); }
				if (node.key < from) { return findSubTree(node.right); }
				return node;
			},

			findSubTreeRev = function(node) {
				//'from' is greater than 'to'.
				if (!node) { return null; }
				if (node.key > from) { return findSubTreeRev(node.left); }
				if (node.key < to) { return findSubTreeRev(node.right); }
				return node;
			};

		if (from < to) {
			traverse(findSubTree(startNode), h_limitCallBack);
		}
		else {
			traverseReverse(findSubTreeRev(startNode), h_limitCallBackRev);
		}
	};

	that.empty = function(n) {
		///Safely empties the tree of all contents.
		//Always call this function before setting a reference to an instance of BinarySearchTree to null.
		
		//Reference counting garbage collectors can leak memory if otherwise unreferenced objects point to each other.
		//This function prevents that by setting all pointers to null.
		
		//After emptying a tree, it can be repopulated safely.
		//A new instance of BinarySearchTree does not have to be created.
		
		if (!n) {
			//Must be first call.
			n = startNode;
			startNode = null;
			
			if (!n) {
				return;		//The tree was never populated at all.
			}
		}
		
		if (n.left) {
			this.empty(n.left);
			n.left.parent = null;
		}
			
		if (n.right) {
			this.empty(n.right);
			n.right.parent = null;
		}
		
		n.left = null;
		n.right = null;

		count = 0;
	};
		
	return that;
};