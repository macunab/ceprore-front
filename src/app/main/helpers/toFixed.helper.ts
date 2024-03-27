
export class ToFixed {

    public static noRoundFixed = (n: number, fixed: number) => ~~(Math.pow(10, fixed) * n) / Math.pow(10, fixed);
}