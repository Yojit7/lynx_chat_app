const PROJECT_ID = 'lynxchatwebapp';

export const sendMessage = async ({
    receiverId,
    senderId,
    message,
}) => {
    try {
        // Create chat room ID by sorting and joining user IDs
        const ids = [senderId, receiverId];
        ids.sort();
        const chatRoomId = ids.join("_");

        console.log("Sending message to chat room:", chatRoomId);

        // Create the message data
        const messageData = {
            message: message,
            senderId: senderId,
            receiverId: receiverId,
            timeStamp: Date.now(),
            createdAt: new Date().toISOString(),
            isDeleted: false
        };

        // URL for nested collection: messageHub/{chatRoomId}/messages
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/messageHub/${chatRoomId}/messages`;

        // Convert data to Firestore format
        const firestoreData = convertToFirestoreFormat(messageData);

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

        console.log("Successfully message added with ID:", docId);

        return {
            id: docId,
            ...messageData
        };
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

// Function to get messages for a specific chat room
export const getMessagesForChatRoom = async (senderId, receiverId) => {
    try {
        // Create chat room ID
        const ids = [senderId, receiverId];
        ids.sort();
        const chatRoomId = ids.join("_");

        console.log("Getting messages for chat room:", chatRoomId);

        // URL for nested collection messages
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/messageHub/${chatRoomId}/messages`;

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
            const messages = result.documents.map(doc => ({
                id: doc.name.split('/').pop(),
                ...convertFromFirestoreFormat(doc.fields)
            }));

            // Sort messages by timestamp
            return messages.sort((a, b) => a.timeStamp - b.timeStamp);
        }

        return [];
    } catch (error) {
        console.error("Error getting messages:", error);
        throw error;
    }
};

// Function to edit a message
export const editMessage = async (senderId, receiverId, messageId, newMessage, originalMessageData) => {
    try {
        // Create chat room ID
        const ids = [senderId, receiverId];
        ids.sort();
        const chatRoomId = ids.join("_");

        // URL for specific message document
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/messageHub/${chatRoomId}/messages/${messageId}`;

        // Update data - send the complete message object with edit metadata (excluding id)
        const { id, ...messageDataWithoutId } = originalMessageData;
        const updateData = {
            ...messageDataWithoutId,
            message: newMessage,
            editedAt: new Date().toISOString(),
            isEdited: true
        };

        // Convert data to Firestore format
        const firestoreData = convertToFirestoreFormat(updateData);

        const response = await fetch(url, {
            method: 'PATCH',
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
        console.log("Message edited successfully:", messageId);

        return {
            id: messageId,
            ...convertFromFirestoreFormat(result.fields)
        };
    } catch (error) {
        console.error("Error editing message:", error);
        throw error;
    }
};

// Function to delete a message
export const deleteMessage = async (senderId, receiverId, messageId, originalMessageData) => {
    try {
        // Create chat room ID
        const ids = [senderId, receiverId];
        ids.sort();
        const chatRoomId = ids.join("_");

        console.log("Deleting message:", messageId, "in chat room:", chatRoomId);

        // URL for specific message document
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/messageHub/${chatRoomId}/messages/${messageId}`;

        // Update data - send the complete message object with delete metadata (excluding id)
        const { id, ...messageDataWithoutId } = originalMessageData;
        const updateData = {
            ...messageDataWithoutId,
            isDeleted: true,
            deletedAt: new Date().toISOString()
        };

        // Convert data to Firestore format
        const firestoreData = convertToFirestoreFormat(updateData);

        const response = await fetch(url, {
            method: 'PATCH',
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
        console.log("Message deleted successfully:", messageId);

        return {
            id: messageId,
            ...convertFromFirestoreFormat(result.fields)
        };
    } catch (error) {
        console.error("Error deleting message:", error);
        throw error;
    }
};

// Generic function for adding documents (keep for other uses)
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

// Helper function to convert JavaScript objects to Firestore format
const convertToFirestoreFormat = (obj) => {
    const result = {};

    for (const [key, value] of Object.entries(obj)) {
        if (value === null || value === undefined) {
            result[key] = { nullValue: null };
        } else if (typeof value === 'string') {
            result[key] = { stringValue: value };
        } else if (typeof value === 'number') {
            if (Number.isInteger(value)) {
                result[key] = { integerValue: value.toString() };
            } else {
                result[key] = { doubleValue: value };
            }
        } else if (typeof value === 'boolean') {
            result[key] = { booleanValue: value };
        } else if (value instanceof Date) {
            result[key] = { timestampValue: value.toISOString() };
        } else if (Array.isArray(value)) {
            result[key] = {
                arrayValue: {
                    values: value.map(item => convertToFirestoreFormat({ item }).item)
                }
            };
        } else if (typeof value === 'object') {
            result[key] = {
                mapValue: {
                    fields: convertToFirestoreFormat(value)
                }
            };
        }
    }

    return result;
};

// Helper function to convert Firestore format to JavaScript objects
const convertFromFirestoreFormat = (fields) => {
    const result = {};

    for (const [key, value] of Object.entries(fields)) {
        if (value.stringValue !== undefined) {
            result[key] = value.stringValue;
        } else if (value.integerValue !== undefined) {
            result[key] = parseInt(value.integerValue);
        } else if (value.doubleValue !== undefined) {
            result[key] = value.doubleValue;
        } else if (value.booleanValue !== undefined) {
            result[key] = value.booleanValue;
        } else if (value.timestampValue !== undefined) {
            result[key] = value.timestampValue;
        } else if (value.nullValue !== undefined) {
            result[key] = null;
        } else if (value.arrayValue !== undefined) {
            result[key] = value.arrayValue.values.map(item =>
                convertFromFirestoreFormat({ temp: item }).temp
            );
        } else if (value.mapValue !== undefined) {
            result[key] = convertFromFirestoreFormat(value.mapValue.fields);
        }
    }

    return result;
};