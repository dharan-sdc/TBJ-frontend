import ADD_STORY_IMG from '../assets/images/add-story.png'
import NO_SEARCH_DATA_IMG from '../assets/images/no-search.png'
import NO_FILTER from '../assets/images/no-filter.png'


export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function getInitials(name) {
    if (!name) return ""

    const words = name.split(" ")
    let initals = ""
    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initals += words[i][0]
    }
    return initals.toUpperCase()
}

export const getEmptyCardMesage = (filterType) => {
    switch (filterType) {
        case "search":
            return `Oops! No Stories found matching your search`;
        case "date":
            return `No Stories found in the given date Range`;
        default:
            return `Start creating your first travel story! Click 'Add' button to jot 
                  down your thoughts, ideas and memories. Let's get started!`;
    }
}

export const getEmptyCardImg = (filterType) => {
    switch (filterType) {
        case "search":
            return NO_SEARCH_DATA_IMG;
        case "date":
            return NO_FILTER;
        default:
            return ADD_STORY_IMG;
    }
}
