/*
Requirements:
- Ability to separate notes from events
- Range of dates
*/

type Thing = {
    description: string,
    type: "event" | "note",
    date: {
        from: string,
        to: string
    }
}

const TEST_COMMANDS: { [key: string]: Thing } = {
    "add jan5 3pm tennis": {
        "description": "3pm tennis",
        "type": "event",
        "date": {
            "from": "5/1/2024",
            "to": "5/1/2024"
        }
    },
    "note apr1 fools day": {
        "description": "fools day",
        "type": "note",
        "date": {
            "from": "1/4/2024",
            "to": "1/4/2024"
        }
    },
    "add jun18-jul31 harry airport 6pm": {
        "description": "harry airport 6pm",
        "type": "event",
        "date": {
            "from": "18/6/2024",
            "to": "31/7/2024"
        }
    },
    "note dec1-jan2 Christmas": {
        "description": "Christmas",
        "type": "note",
        "date": {
            "from": "1/12/2023",
            "to": "2/1/2024"
        }
    }
}

function parseCommand(command: string): Thing {
    const parts = command.split(" ");
    for(let part of parts){
        console.log(part)
    };
    
    //part 0; type of event
    const type = parts[0] === "add" ? "event" : "note";
    
    //part 1; event des
    const description = parts.slice(2).join(' ');
    
    //part 2; date (with and without to/from)
    const parsedDate = parseDate(parts[1]);
    
    return {
        "description": description,
        "type": type,
        "date": parsedDate
    };
}

function parseDate(dateString) { //thanksGPT
    const monthMap = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };
    
    const [startMonth, startDay, endMonth, endDay] = dateString.toLowerCase().match(/[a-z]+|\d+/g);
    
    const today = new Date();
    const currentYear = today.getFullYear();
    
    const startDate = new Date(currentYear, monthMap[startMonth], startDay);
    
    if (startDate < today) {
        startDate.setFullYear(currentYear + 1);
    }
    
    let endDate;
    
    if (endMonth && endDay) {
        endDate = new Date(currentYear, monthMap[endMonth], endDay);
        
        // Increment year if the end date is before the start date
        if (endDate < today || endDate < startDate){
            endDate.setFullYear(currentYear + 1);
        }
    } else {
        endDate = startDate;
    }
    
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    
    return { from: formattedStartDate, to: formattedEndDate };
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}


function testParsing() {
    for (let [command, thing] of Object.entries(TEST_COMMANDS)) {
        const parsed = parseCommand(command);
        if (JSON.stringify(parsed) === JSON.stringify(thing)) {
            console.log(`✅ "${command}"`)
        } else {
            console.log(`❌ "${command}"`)
            console.log(`Expected: ${JSON.stringify(thing)}`)
            console.log(`Actual: ${JSON.stringify(parsed)}`)
        }
        console.log();
    }
}

testParsing();