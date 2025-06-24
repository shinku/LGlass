import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Count } from "../src/components/Count";
import { isPrime } from "../src/utils";
jest.useFakeTimers();
describe("test prime",()=>{
  test("test prime", async ()=>{
    expect(isPrime(3)).toBe(true)
    expect(isPrime(1000)).toBe(false)
    render(<Count />)
    expect(screen.getByText(/Count: 0/i)).toBeInTheDocument();
    jest.advanceTimersByTime(1000)
  });
})