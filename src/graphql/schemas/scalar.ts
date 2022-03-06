import { gql } from "apollo-server-express";

export default gql`
    scalar Date
    scalar DateTime
    scalar Time
    scalar JSON
    scalar JSONObject
    input InputSearchDateTime {
        lt :DateTime
        """Bé hơn hoặc bằng giá trị"""
        lte :DateTime
        """Bằng giá trị"""
        eq:DateTime
        """Không bằng giá trị"""
        ne:DateTime
        """Nằm trong những giá trị"""
        in:[DateTime]
        """Không nằm trong những giá trị"""
        nin:[DateTime]
        """Lón hơn giá trị"""
        gt :DateTime
        """Lón hơn hoặc bằng giá trị"""
        gte :Date
    }

    input InputSearchDate {
        lt :Date
        """Bé hơn hoặc bằng giá trị"""
        lte :Date
        """Bằng giá trị"""
        eq:Date
        """Không bằng giá trị"""
        ne:Date
        """Nằm trong những giá trị"""
        in:[Date]
        """Không nằm trong những giá trị"""
        nin:[Date]
        """Lón hơn giá trị"""
        gt :Date
        """Lón hơn hoặc bằng giá trị"""
        gte :Date
    }
`;
