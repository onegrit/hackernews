function timeDifference(current,previous){
    const milliSecondsPerMinute = 60 * 1000
    const milliSecondsPerHour = milliSecondsPerMinute * 60
    const milliSecondsPerDay = milliSecondsPerHour * 60
    const milliSecondsPerMonth = milliSecondsPerDay * 30
    const milliSecondsPerYear = milliSecondsPerDay * 365

    const elapsed = current - previous

    if (elapsed < milliSecondsPerMinute /3){
        return 'just now'
    }

    if (elapsed < milliSecondsPerMinute){
        return 'less than 1 min ago'
    }else if(elapsed <milliSecondsPerHour){
        return Math.round(elapsed /milliSecondsPerMinute) + 'min ago'
    }else if (elapsed < milliSecondsPerDay){
        return Math.round(elapsed / milliSecondsPerHour) + 'h ago'
    }else if(elapsed < milliSecondsPerMonth){
        return Math.round(elapsed/milliSecondsPerDay) + 'day ago'
    }else if(elapsed< milliSecondsPerYear){
        return Math.round(elapsed / milliSecondsPerMonth) + 'mon ago'
    }else{
        return Math.round(elapsed/ milliSecondsPerYear) + 'year ago'
    }
}

export function timeDifferenceForDate(date){
    const now = new Date().getTime()
    const updated = new Date(date).getTime()
    return timeDifference(now,updated)
}