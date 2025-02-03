export function calculateClosestFraction(value: number) {
    var original_value = value;
    var iteration = 0;
    var denominator = 1,
        last_d = 0,
        numerator;
    while (iteration < 20) {
        value = 1 / (value - Math.floor(value));
        var _d = denominator;
        denominator = Math.floor(denominator * value + last_d);
        last_d = _d;
        numerator = Math.ceil(original_value * denominator);

        if (Math.abs(numerator / denominator - original_value) < 0.0001) {
            break;
        }
        iteration++;
    }
    return { numerator, denominator };
}
