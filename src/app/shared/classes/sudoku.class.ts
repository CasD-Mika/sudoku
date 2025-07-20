import { DEFAULT_MODE } from "../constants/default-mode.const"
import { MODES } from "../constants/modes.const"
import { ModeType } from "../types/mode.type"
import { SudokuOptionsType } from "../types/sudoku-options.type"

export default class Sudoku {
  grid: Array<number[]>
  mode: ModeType
  blockSize: number
  numbers: number[]

  constructor(options: SudokuOptionsType = {}) {
    let modeKey: string

    if (options.grid) {
      modeKey = options.grid.length.toString()
    } else {
      modeKey = options.mode || DEFAULT_MODE
    }

    this.mode = MODES[modeKey]
    this.blockSize = this.mode.width * this.mode.height
    this.numbers = [...Array(this.blockSize)].map((_, i) => i + 1)
    this.grid = options.grid || this.defaultGrid()
  }

  reset() {
    this.grid = this.defaultGrid()
  }

  setBoard = (board: number[][]) => {
    this.grid = board
  }

  defaultGrid() {
    return [...Array(this.blockSize)].map(() => Array(this.blockSize).fill(0))
  }

  get(x: number, y: number): number {
    return this.grid[y][x]
  }

  set(x: number, y: number, value: number): Error | number {
    if (value) {
      if (this.get(x, y) === value) return value
      if (!this.allowedNumbersInRow(y).includes(value)) throw new Error(`${value} is not allowed in the row ${y}`)
      if (!this.allowedNumbersInColumn(x).includes(value)) throw new Error(`${value} is not allowed in the column ${x}`)
      if (!this.allowedNumbersInBlock(x, y).includes(value)) throw new Error(`${value} is not allowed in the block ${y}`)
    }
    return (this.grid[y][x] = value)
  }

  row(y: number): number[] {
    return this.grid[y]
  }

  column(x: number): number[] {
    return this.grid.map(row => row[x])
  }

  allowedNumbersInRow(y: number) {
    const row = this.row(y)
    return this.numbers.filter(num => !row.includes(num))
  }

  allowedNumbersInColumn(x: number) {
    const column = this.column(x)
    return this.numbers.filter(num => !column.includes(num))
  }

  allowedNumbersInBlock(x: number, y: number) {
    const { width, height } = this.mode
    const bx = Math.floor(x / width) * width
    const by = Math.floor(y / height) * height

    let numbersInBlock: number[] = []
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        numbersInBlock.push(this.get(bx + i, by + j))
      }
    }

    return this.numbers.filter(num => !numbersInBlock.includes(num))
  }

  allowedNumbers(x: number, y: number) {
    const inBlock = this.allowedNumbersInBlock(x, y)
    const inRow = this.allowedNumbersInRow(y)
    const inCol = this.allowedNumbersInColumn(x)

    return inBlock.filter(num => inRow.includes(num) && inCol.includes(num))
  }

  emptyCells(): Array<[number, number]> {
    const result: Array<[number, number]> = []
    this.grid.forEach((row, y) => {
      row.forEach((val, x) => {
        if (!val) result.push([x, y])
      })
    })
    return result
  }

  anyEmptyCell(): [number, number] {
    let best: [number, number] = [-1, -1]
    let minOptions = this.blockSize + 1

    for (const [x, y] of this.emptyCells()) {
      const options = this.allowedNumbers(x, y).length
      if (options < minOptions) {
        best = [x, y]
        minOptions = options
      }
    }

    return best
  }

  isSolved() {
    return this.grid.every(row => row.every(cell => cell !== 0))
  }

  solveUltimately(): boolean {
    if (this.isSolved()) return true

    const [x, y] = this.anyEmptyCell()
    const options = this.allowedNumbers(x, y)

    for (const num of options) {
      this.set(x, y, num)
      if (this.solveUltimately()) return true
      this.set(x, y, 0)
    }

    return false
  }

  solve(): number[][] | null {
    const snapshot = this.grid.map(r => [...r])
    if (this.solveUltimately()) return this.grid
    this.grid = snapshot
    return null
  }

  getCount(): number {
    return this.grid.reduce((sum, row) => sum + row.filter(val => val !== 0).length, 0)
  }

  getDifficulty(): string {
    const count = this.getCount()
    if (count >= 40) return "Easy"
    if (count >= 25) return "Medium"
    return "Hard"
  }

  generateFullSolution(): boolean {
    this.reset()

    const fill = (): boolean => {
      const [x, y] = this.anyEmptyCell()
      if (x === -1 || y === -1) return true

      const shuffled = this.numbers.slice().sort(() => Math.random() - 0.5)
      for (const num of shuffled) {
        try {
          this.set(x, y, num)
          if (fill()) return true
        } catch (_) {}
        this.set(x, y, 0)
      }
      return false
    }

    return fill()
  }

  digHoles(targetFilled: number) {
    const total = this.blockSize ** 2
    let toRemove = total - targetFilled

    const coords: Array<[number, number]> = []
    for (let y = 0; y < this.blockSize; y++) {
      for (let x = 0; x < this.blockSize; x++) {
        coords.push([x, y])
      }
    }

    coords.sort(() => Math.random() - 0.5)

    for (const [x, y] of coords) {
      const backup = this.get(x, y)
      this.set(x, y, 0)

      const copy = new Sudoku({ grid: this.grid.map(r => [...r]) })
      let found = 0

      const countSolutions = (): boolean => {
        if (copy.isSolved()) {
          found++
          return found > 1
        }

        const [cx, cy] = copy.anyEmptyCell()
        const opts = copy.allowedNumbers(cx, cy)
        for (const n of opts) {
          try {
            copy.set(cx, cy, n)
            if (countSolutions()) return true
          } catch (_) {}
          copy.set(cx, cy, 0)
        }

        return false
      }

      if (countSolutions()) {
        this.set(x, y, backup)
      } else {
        toRemove--
        if (toRemove <= 0) break
      }
    }
  }

  generate(targetDifficulty: "Easy" | "Medium" | "Hard" | null = null): void {
    const fillMap = {
      Easy: 40 + Math.floor(Math.random() * 10),
      Medium: 28 + Math.floor(Math.random() * 10),
      Hard: 17 + Math.floor(Math.random() * 5)
    }

    const desiredFilled = targetDifficulty ? fillMap[targetDifficulty] : 30 + Math.floor(Math.random() * 30)
    let tries = 5

    while (tries-- > 0) {
      if (!this.generateFullSolution()) continue

      const full = this.grid.map(r => [...r])
      this.digHoles(desiredFilled)

      const diff = this.getDifficulty()
      if (!targetDifficulty || diff === targetDifficulty) return

      this.grid = full
    }

    throw new Error("Failed to generate puzzle with requested difficulty")
  }
}
