export default {


    candidate(input, candArray){
        //this function should take in the input object and an array of candidates and return the candidates
        //that match the search. The idea is to make the code a little more clean than how it currently is
        //and reduce the number of database queries.
        console.log(input);
        let output = [];
        //need to figure out full name search method

        for (let criteria in input) {
            let searchTerm = input[criteria].toLowerCase();
            for (let i = 0; i<candArray.length; i++){
                console.log(candArray[i][criteria], candArray[i][criteria].search(searchTerm));
                if (candArray[i][criteria].toLowerCase().search(searchTerm) !== -1){
                    output.push(candArray[i]);
                }
            }
            console.log(output);
            return output;
        }
        
    }
}