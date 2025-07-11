import { getCurrentUser } from '../firebase/auth'

const PROJECT_ID = 'lynxchatwebapp'; // Replace with your actual Firebase project ID


export const addDocumentToFirestore = async (collection, data) => {
    try {
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}`;

        // Convert data to Firestore format
        const firestoreData = convertToFirestoreFormat(data);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fields: firestoreData
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }

        const result = await response.json();
        const docId = result.name.split('/').pop();

        console.log("Document written with ID: ", docId);
        return { id: docId };
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
};

export const getDocumentsFromFirestore = async (collection) => {
    try {
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }

        const result = await response.json();

        if (result.documents) {
            return result.documents.map(doc => ({
                id: doc.name.split('/').pop(),
                ...convertFromFirestoreFormat(doc.fields)
            }));
        }

        return [];
    } catch (error) {
        console.error("Error getting documents: ", error);
        throw error;
    }
};


// New function specifically for getting user list (excluding current user)
export const getUserListFromFirestore = async (collection = 'users') => {
    try {
        const currentUser = getCurrentUser();
        const allUsers = await getDocumentsFromFirestore(collection);

        // Filter out the current user
        if (currentUser) {
            return allUsers.filter(user => user.email !== currentUser);
        }

        return allUsers;
    } catch (error) {
        console.error("Error getting user list: ", error);
        throw error;
    }
};

// Function to get a specific user by email
export const getUserByEmailFromFirestore = async (email, collection = 'users') => {
    try {
        const allUsers = await getDocumentsFromFirestore(collection);
        return allUsers.find(user => user.email === email) || null;
    } catch (error) {
        console.error("Error getting user by email: ", error);
        throw error;
    }
};

// Function to get current user data (single object, not array)
export const getCurrentUserData = async (collection = 'users') => {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            return null;
        }

        const allUsers = await getDocumentsFromFirestore(collection);
        return allUsers.find(user => user.email === currentUser ) || null;
    } catch (error) {
        console.error("Error getting current user data: ", error);
        throw error;
    }
};

// /**
//  * Get a specific document from Firestore
//  * @param {string} collection - Collection name
//  * @param {string} docId - Document ID
//  * @returns {Promise<object|null>} - Document data or null
//  */
// export const getDocumentFromFirestore = async (collection, docId) => {
//     try {
//         const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${docId}`;

//         const response = await fetch(url, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });

//         if (response.status === 404) {
//             return null; // Document not found
//         }

//         if (!response.ok) {
//             const errorData = await response.text();
//             throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
//         }

//         const result = await response.json();

//         return {
//             id: result.name.split('/').pop(),
//             ...convertFromFirestoreFormat(result.fields)
//         };
//     } catch (error) {
//         console.error("Error getting document: ", error);
//         throw error;
//     }
// };

// /**
//  * Update a document in Firestore
//  * @param {string} collection - Collection name
//  * @param {string} docId - Document ID
//  * @param {object} data - Data to update
//  * @returns {Promise<{id: string}>} - Document ID
//  */
// export const updateDocumentInFirestore = async (collection, docId, data) => {
//     try {
//         const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${docId}`;

//         // Convert data to Firestore format
//         const firestoreData = convertToFirestoreFormat(data);

//         const response = await fetch(url, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 fields: firestoreData
//             })
//         });

//         if (!response.ok) {
//             const errorData = await response.text();
//             throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
//         }

//         const result = await response.json();
//         const updatedDocId = result.name.split('/').pop();

//         console.log("Document updated with ID: ", updatedDocId);
//         return { id: updatedDocId };
//     } catch (error) {
//         console.error("Error updating document: ", error);
//         throw error;
//     }
// };

// /**
//  * Delete a document from Firestore
//  * @param {string} collection - Collection name
//  * @param {string} docId - Document ID
//  * @returns {Promise<boolean>} - Success status
//  */
// export const deleteDocumentFromFirestore = async (collection, docId) => {
//     try {
//         const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${docId}`;

//         const response = await fetch(url, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });

//         if (!response.ok) {
//             const errorData = await response.text();
//             throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
//         }

//         console.log("Document deleted with ID: ", docId);
//         return true;
//     } catch (error) {
//         console.error("Error deleting document: ", error);
//         throw error;
//     }
// };

// /**
//  * Query documents with where condition
//  * @param {string} collection - Collection name
//  * @param {string} field - Field name to query
//  * @param {string} operator - Operator ('EQUAL', 'GREATER_THAN', 'LESS_THAN', etc.)
//  * @param {any} value - Value to compare
//  * @returns {Promise<Array>} - Array of matching documents
//  */
// export const queryDocumentsFromFirestore = async (collection, field, operator, value) => {
//     try {
//         const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`;

//         const query = {
//             structuredQuery: {
//                 from: [{ collectionId: collection }],
//                 where: {
//                     fieldFilter: {
//                         field: { fieldPath: field },
//                         op: operator,
//                         value: convertValueToFirestoreFormat(value)
//                     }
//                 }
//             }
//         };

//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(query)
//         });

//         if (!response.ok) {
//             const errorData = await response.text();
//             throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
//         }

//         const result = await response.json();

//         if (result && result.length > 0) {
//             return result
//                 .filter(item => item.document)
//                 .map(item => ({
//                     id: item.document.name.split('/').pop(),
//                     ...convertFromFirestoreFormat(item.document.fields)
//                 }));
//         }

//         return [];
//     } catch (error) {
//         console.error("Error querying documents: ", error);
//         throw error;
//     }
// };

// Helper function to convert data to Firestore format



const convertToFirestoreFormat = (data) => {
    const converted = {};

    for (const [key, value] of Object.entries(data)) {
        converted[key] = convertValueToFirestoreFormat(value);
    }

    return converted;
};

// Helper function to convert a single value to Firestore format
const convertValueToFirestoreFormat = (value) => {
    if (value === null || value === undefined) {
        return { nullValue: null };
    } else if (typeof value === 'string') {
        return { stringValue: value };
    } else if (typeof value === 'number') {
        if (Number.isInteger(value)) {
            return { integerValue: value.toString() };
        } else {
            return { doubleValue: value };
        }
    } else if (typeof value === 'boolean') {
        return { booleanValue: value };
    } else if (value instanceof Date) {
        return { timestampValue: value.toISOString() };
    } else if (Array.isArray(value)) {
        return {
            arrayValue: {
                values: value.map(item => convertValueToFirestoreFormat(item))
            }
        };
    } else if (typeof value === 'object') {
        return {
            mapValue: {
                fields: convertToFirestoreFormat(value)
            }
        };
    } else {
        return { stringValue: JSON.stringify(value) };
    }
};

// Helper function to convert from Firestore format
const convertFromFirestoreFormat = (fields) => {
    const converted = {};

    for (const [key, value] of Object.entries(fields)) {
        converted[key] = convertValueFromFirestoreFormat(value);
    }

    return converted;
};

// Helper function to convert a single value from Firestore format
const convertValueFromFirestoreFormat = (value) => {
    if (value.stringValue !== undefined) {
        return value.stringValue;
    } else if (value.integerValue !== undefined) {
        return parseInt(value.integerValue);
    } else if (value.doubleValue !== undefined) {
        return parseFloat(value.doubleValue);
    } else if (value.booleanValue !== undefined) {
        return value.booleanValue;
    } else if (value.timestampValue !== undefined) {
        return new Date(value.timestampValue);
    } else if (value.nullValue !== undefined) {
        return null;
    } else if (value.arrayValue !== undefined) {
        return value.arrayValue.values.map(item => convertValueFromFirestoreFormat(item));
    } else if (value.mapValue !== undefined) {
        return convertFromFirestoreFormat(value.mapValue.fields);
    } else {
        return null;
    }
};

// Utility function to generate a custom document ID
export const generateDocumentId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Utility function to add document with custom ID
export const addDocumentWithIdToFirestore = async (collection, docId, data) => {
    try {
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}?documentId=${docId}`;

        // Convert data to Firestore format
        const firestoreData = convertToFirestoreFormat(data);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fields: firestoreData
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
        }

        const result = await response.json();
        const createdDocId = result.name.split('/').pop();

        console.log("Document created with custom ID: ", createdDocId);
        return { id: createdDocId };
    } catch (error) {
        console.error("Error adding document with custom ID: ", error);
        throw error;
    }
};